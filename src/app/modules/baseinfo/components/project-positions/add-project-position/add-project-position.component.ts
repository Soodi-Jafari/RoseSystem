import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { LookupValue } from 'src/app/models/lookup-value';
import { ProjectPosition } from '../../../models/project-position';
import { ProjectPositionService } from '../../../services/project-position.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { Position } from 'src/app/modules/general/enums/position.enum';

@Component({
  selector: 'app-add-project-position',
  templateUrl: './add-project-position.component.html',
  styleUrls: ['./add-project-position.component.css']
})
export class AddProjectPositionComponent implements OnInit {
  @ViewChild("userList") userList;
  @ViewChild("disciplineList") disciplineList;
  
 public sourceUsers: Array<LookupValue>
 public sourceDisc: Array<LookupValue>

 viewModel : ProjectPosition;
 public users: Array<LookupValue>
 public disciplines: Array<LookupValue>
 showDiscipline : boolean;
 isLoading : boolean;

 constructor(public positionService : ProjectPositionService, public dialogRef: MatDialogRef<AddProjectPositionComponent>,
                  @Inject(MAT_DIALOG_DATA) public data: any) {

  }

 ngOnInit(){
   this.viewModel = new ProjectPosition();
   if (!isNullOrUndefined(this.data.id))
      this.getItem(this.data.id);
   else
      this.viewModel = this.data;
   this.showDiscipline = this.data.position.id == Position.PSL || this.data.position.id == Position.Expert || this.data.position.id == Position.DesciplineHead;
   //this.ngAfterViewInit();
   this.getLookups();   
 }

  ngAfterViewInit() {
   const userContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
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
     if (this.showDiscipline == true)
     {
       const disContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
       this.disciplineList.filterChange.asObservable().pipe(
          switchMap(value => from([this.sourceDisc]).pipe(
             tap(() => this.disciplineList.loading = true),
             delay(1000),
             map((items) => items.filter(disContain(value)))
          ))
        )
      .subscribe(x => {
           this.disciplines = x;
      });
    }
 }
  
 getItem(id: number)
 {
   this.isLoading = true;
   this.positionService.getSingle('GetSingle', id.toString()).subscribe((result : any) => {
     this.isLoading = false;
     this.viewModel = result.model;}, error => {    
      this.isLoading = false;
  });     
 }

 getLookups()
 {
   this.isLoading = true;
   this.positionService.getListLookup('Lookups').subscribe((data : any) => 
   {
       this.isLoading = false;
       this.users = this.sourceUsers = data.users;
       this.disciplines = this.sourceDisc = data.disciplines;
   }, error => {    
    this.isLoading = false;
});     
 }
 
 save()
 {
   if (isNullOrUndefined(this.viewModel.user))
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
