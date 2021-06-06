import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from '../general/general.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule, MatListModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatExpansionModule, MatPaginatorModule, MatRadioModule, MatTableModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatTabsModule, MatStepperModule, MatTooltipModule } from '@angular/material';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { ActivitiesComponent } from './components/activities/activities.component';
import { ActivityDetailComponent } from './components/activities/activity-detail/activity-detail.component';
import { ActivityService } from './services/activity.service';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { TimesheetService } from './services/timesheet.service';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { ConfirmEventsComponent } from './components/confirm-events/confirm-events.component';
import { EventViewComponent } from './components/event-view/event-view.component';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';
import { EventStatesLogComponent } from './components/event-view/event-states-log/event-states-log.component';
import { UserRequestsComponent } from './components/user-requests/user-requests.component';
import { PersonnelnoutComponent } from './components/personnelnout/personnelnout.component';
import { ChartModule } from '@progress/kendo-angular-charts';
import { TimesheetBarChartComponent } from './components/timesheet-bar-chart/timesheet-bar-chart.component';
import { DisciplinePlanReportComponent } from './components/discipline-plan-report/discipline-plan-report.component';
import { DisciplineResourcesComponent } from './components/discipline-plan-report/discipline-resources/discipline-resources.component';
import { DisciplineResourcesService } from './services/discipline-resources.service';
import { DisciplinePlanResourceReportComponent } from './components/discipline-plan-report/discipline-plan-resource-report/discipline-plan-resource-report.component';
import { CheckBoxModule } from '@progress/kendo-angular-inputs';
import { PeosonnelsOnOffComponent } from './components/peosonnels-on-off/peosonnels-on-off.component';

@NgModule({
  declarations: [ActivitiesComponent, ActivityDetailComponent, TimesheetComponent, ConfirmEventsComponent, EventViewComponent, EventStatesLogComponent, UserRequestsComponent,PersonnelnoutComponent, TimesheetBarChartComponent, DisciplinePlanReportComponent, DisciplineResourcesComponent, DisciplinePlanResourceReportComponent, PeosonnelsOnOffComponent],
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
    MatStepperModule,
    MatTooltipModule,
    GridModule,
    ExcelModule,
    TreeListModule, 
    TreeViewModule, 
    UploadsModule,
    MatTabsModule,
    ReactiveFormsModule,
    SchedulerModule,
    HttpClientJsonpModule,
    NgxPermissionsModule,
    DpDatePickerModule,
    ChartModule,
    CheckBoxModule
  ],
  
  entryComponents: [
    ActivityDetailComponent,
    DisciplineResourcesComponent
  ],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  providers: [
    NgxPermissionsService,
    ActivityService,
    TimesheetService,
    DisciplineResourcesService
  ]

})
export class TimeAttendanceModule { 

}
