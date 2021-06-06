import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { LookupValue } from 'src/app/models/lookup-value';
import { Activity } from '../../../models/activity';
import { ActivityService } from '../../../services/activity.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { OrganizationPositionService } from 'src/app/modules/baseinfo/services/organization-position.service';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.css']
})
export class ActivityDetailComponent implements OnInit {
  
@ViewChild("sectionLList") sectionLList;
@ViewChild("activityList") activityList;

public sourceActs: Array<LookupValue>
public sourcePos: Array<LookupValue>

viewModel : Activity;
public activities: Array<LookupValue>
public sections: Array<LookupValue>
isLoading : boolean;
activityTypes : any;

constructor(public actService : ActivityService, public orgService: OrganizationPositionService, public dialogRef: MatDialogRef<ActivityDetailComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
           
}

ngOnInit(){

 this.activityTypes = EnumCoding.EventTypes;
 this.viewModel = new Activity();
 if (!isNullOrUndefined(this.data))
    this.getItem(this.data.id);
    
 this.getLookups();   
}

ngAfterViewInit() {
 const actContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
 const secContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;

 this.activityList.filterChange.asObservable().pipe(
       switchMap(value => from([this.sourceActs]).pipe(
           tap(() => this.activityList.loading = true),
           delay(1000),
           map((items) => items.filter(actContain(value)))
       ))
   )
   .subscribe(x => {
       this.activities = x;
   });

   this.sectionLList.filterChange.asObservable().pipe(
     switchMap(value => from([this.sourcePos]).pipe(
         tap(() => this.sectionLList.loading = true),
         delay(1000),
         map((items) => items.filter(secContain(value)))
     ))
 )
 .subscribe(x => {
     this.sections = x;
 });
}

getLookups()
{
  this.isLoading = true;
  this.actService.getList("RootActivities").subscribe((data : any) => 
  {
     this.isLoading = false;
     this.activities = this.sourceActs = data.data;
  }, error => {    
    this.isLoading = false;
  });  

  this.orgService.getOrganizationChart().subscribe((data : any) => 
  {
     this.isLoading = false;
     this.sections = this.sourcePos = data.data;
  }, error => {    
    this.isLoading = false;
  });  
}

getItem(id: number)
{
 this.isLoading = true;
 this.actService.getSingle('GetSingle', id.toString()).subscribe((result : any) => {
   this.isLoading = false;
   this.viewModel = result.model;});
}

save()
{
 if (isNullOrUndefined(this.viewModel.title))
          {
               alert("Please enter required fields!");
                return;
          }
 this.isLoading = true;
 this.actService.Post(this.viewModel).subscribe( result => {
     this.isLoading = false;
     this.dialogRef.close(this.viewModel);
 }, error => {
   this.isLoading = false;
   var errMessage ='';
   if (error.error.length > 0)
       error.error.forEach((err: string) => errMessage = errMessage +  err + '\n');           
   else
      errMessage = error.error.ExceptionMessage;
   
    alert(errMessage);
 });
}

closeDialog() {
 this.dialogRef.close(null);
}
}
