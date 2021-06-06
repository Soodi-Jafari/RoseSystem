import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatToolbarModule, MatButtonModule, MatSidenavModule, MatMenuModule, MatIconModule, MatPaginatorModule, MatTableModule, MatTabsModule, MatCardModule } from '@angular/material';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { UserService } from './services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth/auth.service';
import { InterceptorService } from './interceptor.service';
import { LogoutComponent } from './auth/logout/logout.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginGuard } from './auth/login.guard';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { Subject } from './home/observer/subject';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { ProqurementModule } from './modules/proqurement/proqurement.module';
import { GeneralModule } from './modules/general/general.module';
import { EditService } from './services/edit.service';
import { HomeComponent } from './home/home.component';
import { LayoutModule } from './modules/shared/layout.module';
import { TaskModule } from './modules/task/task.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GridDocumentDashboardComponent } from './dashboard/grid-document-dashboard/grid-document-dashboard.component';
import { ProcurementDashboardComponent } from './dashboard/procurement-dashboard/procurement-dashboard.component';
import { GridIdcDashboardComponent } from './dashboard/grid-idc-dashboard/grid-idc-dashboard.component';
import { TaskDashboardComponent } from './dashboard/task-dashboard/task-dashboard.component';
import { BaseinfoModule } from './modules/baseinfo/baseinfo.module';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignalrService } from './services/signalr.service';
import { UploadModule } from '@progress/kendo-angular-upload';
import { TimeAttendanceModule } from './modules/time-attendance/time-attendance.module';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';








@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    ChangePasswordComponent,
    HomeComponent,
    DashboardComponent,
    GridDocumentDashboardComponent,
    ProcurementDashboardComponent,
    GridIdcDashboardComponent,
    TaskDashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,  
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,  
    DropDownsModule, 
    MatMenuModule,  
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatCardModule,
    NgxPermissionsModule.forRoot(),
 
    LayoutModule,
    ProqurementModule,
    GeneralModule,
    TaskModule,
    BaseinfoModule,
    TimeAttendanceModule,
    TreeViewModule,
    BrowserAnimationsModule,
    UploadModule,
    TreeListModule,
    SchedulerModule,
    ChartsModule
    
  ],
 
  entryComponents: [   
    ChangePasswordComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    }, 
    NgxPermissionsService,
    HttpClient,
    AuthService,
    CookieService,
    UserService,
    AuthGuard,
    LoginGuard,
    Subject,
    EditService,
   // SignalrService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
