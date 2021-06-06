import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlannedTasksComponent } from './components/planned-tasks/planned-tasks.component';
import { CreatePlannedTaskComponent } from './components/planned-tasks/create-planned-task/create-planned-task.component';
import { GeneralModule } from '../general/general.module';
import { TimesheetUserReportComponent } from '../time-attendance/components/timesheet-user-report/timesheet-user-report.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule, MatListModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatExpansionModule, MatPaginatorModule, MatRadioModule, MatTableModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatTabsModule } from '@angular/material';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { PlannedTaskService } from './services/planned-task.service';
import { AssignPlanTaskComponent } from './components/planned-tasks/assign-plan-task/assign-plan-task.component';
import { PlannedTaskApprovalComponent } from './components/planned-tasks/planned-task-approval/planned-task-approval.component';
import { TaskCartableComponent } from './components/task-cartable/task-cartable.component';
import { PlannedTaskCartableComponent } from './components/task-cartable/planned-task-cartable/planned-task-cartable.component';
import { CreateNextRevTaskComponent } from './components/planned-tasks/create-planned-task/create-next-rev-task/create-next-rev-task.component';
import { CreateCommentTaskComponent } from './components/planned-tasks/create-planned-task/create-comment-task/create-comment-task.component';
import { TaskIdcCartableComponent } from './components/task-cartable/task-idc-cartable/task-idc-cartable.component';
import { PlannedTaskIdcsComponent } from './components/planned-task-idcs/planned-task-idcs.component';
import { AddNextRevComponent } from './components/planned-tasks/create-planned-task/add-next-rev/add-next-rev.component';
import { ChangeTaskDocumentsTitleComponent } from './components/planned-tasks/create-planned-task/change-task-documents-title/change-task-documents-title.component';
import { EditPlanTaskComponent } from './components/planned-tasks/edit-plan-task/edit-plan-task.component';
import { TransmittalDocumentService } from './services/transmittal-document.service';
import { TransmittalService } from './services/transmittal.service';
import { TransmittalsComponent } from './components/transmittals/transmittals.component';
import { TransmittalDetailComponent } from './components/transmittals/transmittal-detail/transmittal-detail.component';
import { TransmittalDocumentsComponent } from './components/transmittal-documents/transmittal-documents.component';
import { TransmittalDocumentDetailComponent } from './components/transmittal-documents/transmittal-document-detail/transmittal-document-detail.component';
import { AddIssueDocumentComponent } from './components/transmittal-documents/transmittal-document-detail/add-issue-document/add-issue-document.component';
import { AddCommentDocumentComponent } from './components/transmittal-documents/transmittal-document-detail/add-comment-document/add-comment-document.component';
import { DocumentFilesComponent } from './components/transmittal-documents/document-files/document-files.component';
import { CommentFilesComponent } from './components/transmittal-documents/comment-files/comment-files.component';
import { PctTransmittalDocumentsComponent } from './components/pct-transmittal-documents/pct-transmittal-documents.component';
import { TransmittalReportFileComponent } from './components/transmittals/transmittal-report-file/transmittal-report-file.component';
import { ProjectService } from '../baseinfo/services/project.service';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ImportDocumentFileComponent } from './components/import-document-file/import-document-file.component';
import { RejectedTaskReportComponent } from './components/planned-tasks/rejected-task-report/rejected-task-report.component';
import { UploadTransmittalComponent } from './components/transmittals/upload-transmittal/upload-transmittal.component';

@NgModule({
  declarations: [
    PlannedTasksComponent, 
    CreatePlannedTaskComponent,
    TimesheetUserReportComponent, 
    AssignPlanTaskComponent, 
    PlannedTaskApprovalComponent,
    TaskCartableComponent, 
    PlannedTaskCartableComponent,
    CreateNextRevTaskComponent,
    CreateCommentTaskComponent,
    TaskIdcCartableComponent,
    PlannedTaskIdcsComponent,
    AddNextRevComponent,
    ChangeTaskDocumentsTitleComponent,
    EditPlanTaskComponent,
    TransmittalsComponent,
    TransmittalDetailComponent,
    TransmittalDocumentsComponent,
    TransmittalDocumentDetailComponent,
    AddIssueDocumentComponent,
    AddCommentDocumentComponent,
    DocumentFilesComponent,
    CommentFilesComponent,
    PctTransmittalDocumentsComponent,
    TransmittalReportFileComponent,
    ImportDocumentFileComponent,
    RejectedTaskReportComponent,
    UploadTransmittalComponent],

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
    UploadsModule,
    MatTabsModule,
    NgxPermissionsModule,
    PDFExportModule 
  ],

  entryComponents: [
    CreateCommentTaskComponent,
    AddNextRevComponent,
    ChangeTaskDocumentsTitleComponent,
    EditPlanTaskComponent,
    TransmittalDetailComponent,
    DocumentFilesComponent,
    CommentFilesComponent,
    UploadTransmittalComponent

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  providers: [
    NgxPermissionsService,
    PlannedTaskService,
    TransmittalService,
    TransmittalDocumentService,
    ProjectService
  ]
})
export class TaskModule { }
 