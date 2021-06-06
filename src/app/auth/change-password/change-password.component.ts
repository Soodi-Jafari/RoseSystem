import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

/*   username : string
  oldPassword: string;
  newPassword: string; */
 // @ViewChild("oldPassword") oldPassword;
  viewModel : any;
  constructor(private userService: UserService,public dialogRef: MatDialogRef<ChangePasswordComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) { 
                  this.viewModel = {};
                  this.viewModel.username = data.username;
                
  }

  ngOnInit() {
    //this.oldPassword.elementRef.nativeElement.firstElementChild.innerHTML = null;
  }

  save()
  {
    if (!isNullOrEmptyString(this.viewModel.oldPassword))
    {
      this.userService.changePassword(this.viewModel.username,this.viewModel.oldPassword,this.viewModel.newPassword).subscribe( result => {
             this.dialogRef.close();
       });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
