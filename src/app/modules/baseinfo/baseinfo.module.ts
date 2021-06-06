import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from '../general/general.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule, MatListModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatExpansionModule, MatPaginatorModule, MatRadioModule, MatTableModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatTabsModule } from '@angular/material';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { UploadModule } from '@progress/kendo-angular-upload';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { UsersComponent } from './components/users/users.component';
import { UserDetailComponent } from './components/users/user-detail/user-detail.component';
import { SecurityUserService } from './services/security-user.service';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectDetailComponent } from './components/projects/project-detail/project-detail.component';
import { ProjectService } from './services/project.service';
import { ProjectPositionService } from './services/project-position.service';
import { ProjectPositionsComponent } from './components/project-positions/project-positions.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { AddProjectPositionComponent } from './components/project-positions/add-project-position/add-project-position.component';
import { OrganizationPositionComponent } from './components/organization-position/organization-position.component';
import { AssignOrganizationPositionComponent } from './components/organization-position/assign-organization-position/assign-organization-position.component';
import { OrganizationPositionService } from './services/organization-position.service';
import { PctLevelComponent } from './components/pct-level/pct-level.component';
import { PCTService } from './services/pct.service';
import { PctDetailComponent } from './components/pct-level/pct-detail/pct-detail.component';
import { PctConditionComponent } from './components/pct-level/pct-condition/pct-condition.component';
import { CustomersComponent } from './components/customers/customers.component';
import { CustomerDetailComponent } from './components/customers/customer-detail/customer-detail.component';
import { CustomerService } from './services/customer.service';

@NgModule({
  declarations: [
    UsersComponent, 
    UserDetailComponent,
    ProjectsComponent,
    ProjectDetailComponent,
    ProjectPositionsComponent,
    AddProjectPositionComponent,
    OrganizationPositionComponent,
    AssignOrganizationPositionComponent,
    PctLevelComponent,
    PctDetailComponent,
    PctConditionComponent,
    CustomersComponent,
    CustomerDetailComponent],
  imports: [
    CommonModule,
    GeneralModule,

    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatRadioModule,
    DropDownsModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    GridModule,
    ExcelModule,
    UploadModule,
    TreeViewModule,    
    MatTabsModule,
    NgxPermissionsModule
  ],
  entryComponents: [
    UserDetailComponent,
    ProjectDetailComponent,
    AddProjectPositionComponent,
    AssignOrganizationPositionComponent,
    PctConditionComponent,
    CustomerDetailComponent
  ],
  providers: [
    NgxPermissionsService,
    SecurityUserService,
    ProjectService,
    ProjectPositionService,
    OrganizationPositionService,
    PCTService,
    CustomerService
  ]
})
export class BaseinfoModule { 

}
