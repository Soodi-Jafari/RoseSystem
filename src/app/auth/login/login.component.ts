import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../auth.service';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ChangePasswordComponent } from '../change-password/change-password.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('errorMessage') errorMessage: ElementRef;
  username: string;
  password: string;
  isLoading : boolean;
  constructor(private cookieService: CookieService, 
          private authService: AuthService, private router: Router
          ,private dialog: MatDialog) {

            this.isLoading = false;
           }

  ngOnInit() {
  }

  login() {
    this.isLoading = true;
    this.errorMessage.nativeElement.hidden = true;
    this.authService.login(this.username, this.password).subscribe(res => {
      this.isLoading = false;
        if (!res) {
          this.errorMessage.nativeElement.hidden = false;
        } else {
          this.router.navigate(['/home/dashboard']);
        }
    }, error => {
      this.isLoading = false;
      this.errorMessage.nativeElement.hidden = false;
    });
  }

  changePassword() {
    
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "500px";
    dialogConfig.height = "400px";
    dialogConfig.data = {username : this.username};

    const dialogRef = this.dialog.open(ChangePasswordComponent, dialogConfig);
        
  }
}
