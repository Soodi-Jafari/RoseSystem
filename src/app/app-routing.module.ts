import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { VendorsComponent } from './modules/proqurement/components/vendors/vendors.component';
import { ItemsComponent } from './modules/proqurement/components/items/items.component';
import { MrpsComponent } from './modules/proqurement/modules/mrp/components/mrps.component';
import { MrpvendorflowsComponent } from './modules/proqurement/modules/mrp/components/mrpvendorflows/mrpvendorflows.component';
import { ContractsComponent } from './modules/proqurement/modules/contract/components/contracts/contracts.component';
import { MrpvendorflowDetailComponent } from './modules/proqurement/modules/mrp/components/mrpvendorflows/mrpvendorflow-detail/mrpvendorflow-detail.component';
import { ProqurementModule } from './modules/proqurement/proqurement.module';
import { GeneralModule } from './modules/general/general.module';
import { VendorflowCartableComponent } from './modules/proqurement/components/vendorflow-cartable/vendorflow-cartable.component';
import { IdcDetailComponent } from './modules/proqurement/components/idcs/idc-detail/idc-detail.component';
import { VendorOffersComponent } from './modules/proqurement/modules/mrp/components/vendor-offers/vendor-offers.component';
import { VendorTransmittalsComponent } from './modules/proqurement/modules/contract/components/vendor-transmittals/vendor-transmittals.component';
import { VdrComponent } from './modules/proqurement/modules/contract/components/vdr/vdr.component';
import { IdcsComponent } from './modules/proqurement/components/idcs/idcs.component';
import { VandorDocumentsComponent } from './modules/proqurement/modules/contract/components/vandor-documents/vandor-documents.component';
import { VpisReportComponent } from './modules/proqurement/modules/contract/components/vpis-report/vpis-report.component';
import { HomeComponent } from './home/home.component';
import { TimesheetUserReportComponent } from './modules/time-attendance/components/timesheet-user-report/timesheet-user-report.component';
import { CreatePlannedTaskComponent } from './modules/task/components/planned-tasks/create-planned-task/create-planned-task.component';
import { AssignPlanTaskComponent } from './modules/task/components/planned-tasks/assign-plan-task/assign-plan-task.component';
import { TaskCartableComponent } from './modules/task/components/task-cartable/task-cartable.component';
import { PlannedTasksComponent } from './modules/task/components/planned-tasks/planned-tasks.component';
import { PlannedTaskApprovalComponent } from './modules/task/components/planned-tasks/planned-task-approval/planned-task-approval.component';
import { PlannedTaskIdcsComponent } from './modules/task/components/planned-task-idcs/planned-task-idcs.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './modules/baseinfo/components/users/users.component';
import { ProjectsComponent } from './modules/baseinfo/components/projects/projects.component';
import { ProjectPositionsComponent } from './modules/baseinfo/components/project-positions/project-positions.component';
import { OrganizationPositionComponent } from './modules/baseinfo/components/organization-position/organization-position.component';
import { TransmittalsComponent } from './modules/task/components/transmittals/transmittals.component';
import { TransmittalDocumentDetailComponent } from './modules/task/components/transmittal-documents/transmittal-document-detail/transmittal-document-detail.component';
import { TransmittalDocumentsComponent } from './modules/task/components/transmittal-documents/transmittal-documents.component';
import { PctLevelComponent } from './modules/baseinfo/components/pct-level/pct-level.component';
import { PctDetailComponent } from './modules/baseinfo/components/pct-level/pct-detail/pct-detail.component';
import { PctTransmittalDocumentsComponent } from './modules/task/components/pct-transmittal-documents/pct-transmittal-documents.component';
import { CustomersComponent } from './modules/baseinfo/components/customers/customers.component';
import { TransmittalReportFileComponent } from './modules/task/components/transmittals/transmittal-report-file/transmittal-report-file.component';
import { RejectedTaskReportComponent } from './modules/task/components/planned-tasks/rejected-task-report/rejected-task-report.component';
import { ImportDocumentFileComponent } from './modules/task/components/import-document-file/import-document-file.component';
import { ActivitiesComponent } from './modules/time-attendance/components/activities/activities.component';
import { TimesheetComponent } from './modules/time-attendance/components/timesheet/timesheet.component';
import { ConfirmEventsComponent } from './modules/time-attendance/components/confirm-events/confirm-events.component';
import { EventViewComponent } from './modules/time-attendance/components/event-view/event-view.component';
import { UserRequestsComponent } from './modules/time-attendance/components/user-requests/user-requests.component';
import { PersonnelnoutComponent } from './modules/time-attendance/components/personnelnout/personnelnout.component';
import { TimesheetBarChartComponent } from './modules/time-attendance/components/timesheet-bar-chart/timesheet-bar-chart.component';
import { DisciplinePlanReportComponent } from './modules/time-attendance/components/discipline-plan-report/discipline-plan-report.component';
import { DisciplineResourcesComponent } from './modules/time-attendance/components/discipline-plan-report/discipline-resources/discipline-resources.component';
import { DisciplinePlanResourceReportComponent } from './modules/time-attendance/components/discipline-plan-report/discipline-plan-resource-report/discipline-plan-resource-report.component';
import { PeosonnelsOnOffComponent } from './modules/time-attendance/components/peosonnels-on-off/peosonnels-on-off.component';
import { VendorFlowDeleyReportComponent } from './modules/proqurement/modules/mrp/components/vendor-flow-deley-report/vendor-flow-deley-report.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'procurement',
        canActivate: [AuthGuard],
        children: [
          { path: 'cartable', component: VendorflowCartableComponent },
          {
            path: 'baseTabel',
            children: [
              { path: 'vendors', component: VendorsComponent },
              { path: 'procumentItems', component: ItemsComponent },
              { path: 'mrps', component: MrpsComponent },
            ]
          },
          { path: 'preOrder', component: MrpsComponent },
          { path: 'idc/:id/:entityId/:entityType', component: IdcDetailComponent },
          { path: 'preOrder/vendorflow/:mrpId', component: MrpvendorflowsComponent },
          { path: 'preOrder/vendorflow/detail/:mrpId/:venId/:venTitle/:id/:parentId', component: MrpvendorflowDetailComponent, runGuardsAndResolvers: `always` },
          { path: 'vendorOffer', component: VendorOffersComponent },
          { path: 'vendorDocument', component: VandorDocumentsComponent },
          { path: 'vendorIdc', component: IdcsComponent },
          { path: 'contracts', component: ContractsComponent },
          { path: 'contract/transmittal/:contractId', component: VendorTransmittalsComponent },
          { path: 'vdr/:id', component: VdrComponent },
          { path: 'vpisreport', component: VpisReportComponent },
          { path: 'delay-report', component: VendorFlowDeleyReportComponent },

        ]
      },
      {
        path: 'task',
        canActivate: [AuthGuard],
        children: [
          { path: 'taskCartable', component: TaskCartableComponent },
          { path: 'createPlannedTask', component: CreatePlannedTaskComponent },
          { path: 'assignPlannedTask', component: AssignPlanTaskComponent },
          { path: 'plannedTaskList', component: PlannedTasksComponent },
          { path: 'plannedTaskApproval/:id', component: PlannedTaskApprovalComponent },
          { path: 'plannedTaskIdcs', component: PlannedTaskIdcsComponent },
          { path: 'rejectedPlannedTasks', component: RejectedTaskReportComponent },
        ]
      },
      {
        path: 'document',
        canActivate: [AuthGuard],
        children: [
          { path: 'transmittal', component: TransmittalsComponent },
          { path: 'transmittalDocuments', component: TransmittalDocumentsComponent },
          { path: 'transmittalDocument/:id', component: TransmittalDocumentDetailComponent },
          { path: 'pctDocuments', component: PctTransmittalDocumentsComponent },
          { path: 'transmittalReport/:transmittalId/:peojectId', component: TransmittalReportFileComponent },
          { path: 'importDocumentWeight', component: ImportDocumentFileComponent },
        ]
      },
      {
        path: 'timesheet',
        canActivate: [AuthGuard],
        children: [
          { path: 'activities', component: ActivitiesComponent },
          { path: 'userTimesheet', component: TimesheetComponent },
          { path: 'confirmEvents', component: ConfirmEventsComponent },
          { path: 'eventView/:eventType/:position/:id', component: EventViewComponent },
          { path: 'userRequests', component: UserRequestsComponent },
          { path: 'personnelInout', component: PersonnelnoutComponent },
          { path: 'personnelOnoff', component: PeosonnelsOnOffComponent },
          {
            path: 'report',
            children: [
              { path: 'timesheetChart', component: TimesheetBarChartComponent },
              { path: 'disciplinePlanReport', component: DisciplinePlanReportComponent },
              { path: 'disciplinePlanResource', component: DisciplinePlanResourceReportComponent },
              { path: 'timesheetReport', component: TimesheetUserReportComponent },              
            ]
          },
        ]

      },
      {
        path: 'baseinfo',
        canActivate: [AuthGuard],
        children: [
          { path: 'users', component: UsersComponent },
          { path: 'projects', component: ProjectsComponent },
          { path: 'projectPositions', component: ProjectPositionsComponent },
          { path: 'organizationPositions', component: OrganizationPositionComponent },
          { path: 'pctLevels', component: PctLevelComponent },
          { path: 'pctDetail/:id', component: PctDetailComponent },
          { path: 'customers', component: CustomersComponent },
        ]
      },
    ]
  },

  { path: '**', redirectTo: '/home/dashboard' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: `reload` }),
    ProqurementModule,
    GeneralModule

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
