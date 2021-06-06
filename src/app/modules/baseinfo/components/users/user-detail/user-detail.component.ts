import { Component, OnInit, Inject } from '@angular/core';
import { SecurityUser } from '../../../models/security-user';
import { SecurityUserService } from '../../../services/security-user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  viewModel : SecurityUser;
  isLoading : boolean;
  isEditMode: boolean;
  constructor(public userervice : SecurityUserService, public dialogRef: MatDialogRef<UserDetailComponent>,
                   @Inject(MAT_DIALOG_DATA) public data: any) {
              this.isEditMode = false;
   }

  ngOnInit(){
    this.viewModel = new SecurityUser();
    if (!isNullOrUndefined(this.data))
    {
      this.isEditMode = true;
      this.getUser(this.data.id); 
    }
    else
    {
      this.viewModel.isActive = true;
      this.viewModel.gender = 5;
      this.viewModel.startJob = new Date();
    }
  }
 
  getUser(id: number)
  {
    this.isLoading = true;
    this.userervice.getSingle('GetSingle',`${id}`).subscribe((result : any) => {
      this.isLoading = false;
      this.viewModel = result.model;}, error => {    
        this.isLoading = false;
    });     
  }

  save()
  {
    if (isNullOrEmptyString(this.viewModel.lastName) || isNullOrEmptyString(this.viewModel.password)  || isNullOrEmptyString(this.viewModel.username)
             || isNullOrEmptyString(this.viewModel.personelCode) || isNullOrEmptyString(this.viewModel.companyEmail))
             {
                  alert("Please enter required fields!");
                   return;
             }
    this.isLoading = true;
    this.userervice.Post(this.viewModel).subscribe( result => {
        this.isLoading = false;
        this.dialogRef.close(result);
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

