import { Component, OnInit, ViewChild } from '@angular/core';
import { Project } from 'src/app/models/project';
import { LookupValue } from 'src/app/models/lookup-value';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';
import { _MatTabHeaderMixinBase } from '@angular/material/tabs/typings/tab-header';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor, State, process } from '@progress/kendo-data-query';
import { TimeSheetReport } from '../../models/time-sheet-report';
import { TimesheetService } from '../../services/timesheet.service';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { CommonService } from 'src/app/services/common.service';
import { Position } from 'src/app/modules/general/enums/position.enum';
import { time } from 'console';

@Component({
  selector: 'app-timesheet-user-report',
  templateUrl: './timesheet-user-report.component.html',
  styleUrls: ['./timesheet-user-report.component.css']
})
export class TimesheetUserReportComponent implements OnInit {

  @ViewChild("projectList") projectList;
  @ViewChild("userList") userList;

  isLoading: boolean;
  viewModel: any;
  timeSheetReport: Array<TimeSheetReport>;
  projects: Array<Project>;
  sourceProjs: Array<Project>;
  sourceUsers: LookupValue[];
  users: LookupValue[];
  orgUsers: LookupValue[];
  eventTypes: any[];
  currUserRoles: LookupValue[];
  excellData: any[];
  public gridView: GridDataResult;
  state: State = {
  };
  public pageSize = 100;
  public skip = 0;
  constructor(public timeService: TimesheetService, public commonService: CommonService) {
    this.viewModel = {};
    this.timeSheetReport = [];
    this.viewModel.endTask = new Date();
  }

  ngOnInit() {
    this.eventTypes = EnumCoding.EventTypes;
    this.viewModel.eventTypes = []; // this.eventTypes.filter(x => x.id == 1 || x.id == 2 || x.id == 5);
    this.gridView = process(this.timeSheetReport, this.state);
    this.getOrganizationUser();
    this.getAllProject();
    this.getUserOrganiyationRole();
  }

  ngAfterViewInit() {
    const contains = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    this.projectList.filterChange.asObservable().pipe(
      switchMap(value => from([this.sourceProjs]).pipe(
        tap(() => this.projectList.loading = true),
        delay(1000),
        map((projs) => projs.filter(contains(value)))
      ))
    )
      .subscribe(x => {
        this.projects = x;
      });

    const usercontains = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    this.userList.filterChange.asObservable().pipe(
      switchMap(value => from([this.sourceUsers]).pipe(
        tap(() => this.userList.loading = true),
        delay(1000),
        map((items) => items.filter(usercontains(value)))
      ))
    )
      .subscribe(x => {
        this.users = x;
      });
  }
  getUserOrganiyationRole() {
    this.commonService.GetUserOrganizationRole().subscribe((result: any) => {
      this.currUserRoles = result.data;
    });
  }

  getOrganizationUser() {
    this.isLoading = true;
    this.timeService.GetOrganizationUsers().subscribe((result: any) => {
      this.isLoading = false;
      this.orgUsers = result.data;
      this.users = [];
      _.forEach(this.orgUsers, (item: any) => this.users.push(item));
      this.sourceUsers = this.users;
    });
  }

  getAllProject() {
    this.timeService.GetAllProjects().subscribe((result: any) => {
      result.data.push({
        id: "00000000-0000-0000-0000-000000000000",
        pmProjectId: 0,
        title: "General"
      })
      this.projects = this.sourceProjs = _.orderBy(result.data, ['pmProjectId'], ['asc']);
    });
  }

  public projectSelectionChange(value: Project): void {
    this.viewModel.user = undefined;
    if (!isNullOrUndefined(value) && !isNullOrUndefined(value.roles)) {
      this.isLoading = true;
      this.timeService.GetProjectUsers(value).subscribe((result: any) => {
        this.isLoading = false;
        this.users = [];
        // _.forEach(this.orgUsers, (item : any) => this.users.push(item));
        _.forEach(result.data, (user: any) => {
          var ids = this.users.map((item: any) => item.id);
          if (!ids.includes(user.id)) {
            this.users.push(user);
          }
        });
        this.sourceUsers = this.users;
      }, error => {
        this.isLoading = false;
      });
    }
    else {
      this.users = [];
      _.forEach(this.orgUsers, (item: any) => this.users.push(item));
      this.sourceUsers = this.users;
    }
  }

  filter() {
    if (isNullOrUndefined(this.viewModel.startTask) || isNullOrUndefined(this.viewModel.endTask)) {
      alert("Please enter required fields!");
      return;
    }

    if (isNullOrUndefined(this.viewModel.user)) {
      alert("Please enter required fields!");
      return;
    }
    if (this.viewModel.startTask > this.viewModel.endTask) {
      alert("تاریخ شروع نمیتواند از تاریخ پایان بزرگتر باشد!");
      return;
    }
    var endDate = new Date(this.viewModel.endTask);
    var filterModel = {
      eventTypes: this.viewModel.eventTypes.map((item: any) => item.id),
      projectId: !isNullOrUndefined(this.viewModel.project) ? this.viewModel.project.id : null,
      userId: !isNullOrUndefined(this.viewModel.user) ? this.viewModel.user.id : 0,
      startDate: new Date(this.viewModel.startTask),
      endDate: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59)
    };
    this.isLoading = true;
    this.timeService.GetTimeSheetReport(filterModel).subscribe((result: any) => {
      this.timeSheetReport = result.data;
      this.isLoading = false;
      this.gridView = process(this.timeSheetReport, this.state);
      this.setExcellData();
    }, error => {
      this.isLoading = false;
    });
  }

  projectReport() {
    if (isNullOrUndefined(this.viewModel.startTask) || isNullOrUndefined(this.viewModel.endTask)) {
      alert("Please enter required fields!");
      return;
    }

    if (this.viewModel.startTask > this.viewModel.endTask) {
      alert("تاریخ شروع نمیتواند از تاریخ پایان بزرگتر باشد!");
      return;
    }
    var endDate = new Date(this.viewModel.endTask);
    var filterModel = {
      eventTypes: this.viewModel.eventTypes.map((item: any) => item.id),
      projectId: !isNullOrUndefined(this.viewModel.project) ? this.viewModel.project.id : null,
      userId: !isNullOrUndefined(this.viewModel.user) ? this.viewModel.user.id : 0,
      startDate: new Date(this.viewModel.startTask),
      endDate: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59)
    };
    this.isLoading = true;
    this.timeService.GetTimeSheetProjectReport(filterModel).subscribe((result: any) => {
      this.timeSheetReport = result.data;
      this.isLoading = false;
      this.gridView = process(this.timeSheetReport, this.state);
      this.setExcellData();
    }, error => {
      this.isLoading = false;
    });
  }

  allReport() {
    if (isNullOrUndefined(this.viewModel.startTask) || isNullOrUndefined(this.viewModel.endTask)) {
      alert("Please enter required fields!");
      return;
    }

    if (this.viewModel.startTask > this.viewModel.endTask) {
      alert("تاریخ شروع نمیتواند از تاریخ پایان بزرگتر باشد!");
      return;
    }
    var endDate = new Date(this.viewModel.endTask);
    var filterModel = {
      eventTypes: this.viewModel.eventTypes.map((item: any) => item.id),
      projectId: !isNullOrUndefined(this.viewModel.project) ? this.viewModel.project.id : null,
      userId: !isNullOrUndefined(this.viewModel.user) ? this.viewModel.user.id : 0,
      startDate: new Date(this.viewModel.startTask),
      endDate: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59)
    };
    this.isLoading = true;
    this.timeService.GetTimeSheetAllReport(filterModel).subscribe((result: any) => {
      this.timeSheetReport = result.data;
      this.isLoading = false;
      this.gridView = process(this.timeSheetReport, this.state);
      this.setExcellData();
    }, error => {
      this.isLoading = false;
    });
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.setGrid();
  }
  private setGrid(): void {
    this.gridView = {
      data: this.timeSheetReport.slice(this.skip, this.skip + this.pageSize),
      total: this.timeSheetReport.length
    };
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.setGrid();
  }
  getEventTypeTitle(id) {
    if (!isNullOrUndefined(id))
      return EnumCoding.EventTypes.find((t: any) => t.id == id).title;
  }

  getStateTitle(id) {
    if (!isNullOrUndefined(id))
      return EnumCoding.EventStatus.find((t: any) => t.id == id).title;
  }
  setExcellData() {
    this.excellData = this.timeSheetReport.map((item: TimeSheetReport) => {
      //var sd = new Date(item.startDate);
      //  var ed = new Date(item.endDate);
      return {
        id: item.id,
        owner: item.owner,
        project: item.project,
        department: item.department,
        section: item.organizationRole,
        title: item.title,
        activity: item.activity,
        activityDetail: item.activityDetail,
        personelCode: item.personelCode,
        date: new Date(item.startDate),
        start: item.isAllDay == false ? new Date(item.startDate) : null,
        end: item.isAllDay == false ? new Date(item.endDate) : null,
        duration: item.durationNumber,
        eventType: this.getEventTypeTitle(item.eventType),
        currentStatus: this.getStateTitle(item.currentStatus),
        startDateJalali: item.startDateJalali,
        endDateJalali: item.endDateJalali,
        description: item.description,
        subject: item.subject
      };
    });
  }
}
