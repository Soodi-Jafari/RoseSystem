import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { LookupValue } from 'src/app/models/lookup-value';
import { OrganizationPosition } from '../../../models/organization-position';
import { OrganizationPositionService } from '../../../services/organization-position.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-assign-organization-position',
  templateUrl: './assign-organization-position.component.html',
  styleUrls: ['./assign-organization-position.component.css']
})
export class AssignOrganizationPositionComponent implements OnInit {
  @ViewChild("userList") userList;
  @ViewChild("positionList") positionList;
  
 public sourceUsers: Array<LookupValue>
 public sourcePos: Array<LookupValue>

 viewModel : OrganizationPosition;
 public users: Array<LookupValue>
 public positions: Array<LookupValue>
 isLoading : boolean;

 constructor(public positionService : OrganizationPositionService, public dialogRef: MatDialogRef<AssignOrganizationPositionComponent>,
                  @Inject(MAT_DIALOG_DATA) public data: any) {
             
  }

 ngOnInit(){
   this.viewModel = new OrganizationPosition();
   if (!isNullOrUndefined(this.data.id))
      this.getItem(this.data.id);
   else
      this.viewModel = this.data;
   this.getLookups();   
 }

  ngAfterViewInit() {
   const userContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
   const disContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;

   this.userList.filterChange.asObservable().pipe(
         switchMap(value => from([this.sourceUsers]).pipe(
             tap(() => this.userList.loading = true),
             delay(1000),
             map((items) => items.filter(userContain(value)))
         ))
     )
     .subscribe(x => {
         this.users = x;
     });

     this.positionList.filterChange.asObservable().pipe(
       switchMap(value => from([this.sourcePos]).pipe(
           tap(() => this.positionList.loading = true),
           delay(1000),
           map((items) => items.filter(disContain(value)))
       ))
   )
   .subscribe(x => {
       this.positions = x;
   });
 }

 getLookups()
 {
   this.positionService.getListLookup('Lookups').subscribe((data : any) => 
   {
       this.isLoading = false;
       this.users = this.sourceUsers = data.users;
       this.positions = this.sourcePos = data.positions;
   }, error => {    
    this.isLoading = false;
});     
 }
  
 getItem(id: number)
 {
   this.isLoading = true;
   this.positionService.getSingle('GetSingle', id.toString()).subscribe((result : any) => {
     this.isLoading = false;
     this.viewModel = result.model;
    }, error => {    
      this.isLoading = false;
  });     
 }
 
 save()
 {
   if (isNullOrUndefined(this.viewModel.user) || isNullOrUndefined(this.viewModel.position) || isNullOrUndefined(this.viewModel.discipline))
            {
                 alert("Please enter required fields!");
                  return;

            }
   this.isLoading = true;
   this.positionService.Post(this.viewModel).subscribe( result => {
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
   this.dialogRef.close();
 }
}
