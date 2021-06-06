import { Component, OnInit, ViewChild } from '@angular/core';
import { Timesheet } from '../../models/timesheet';
import { Router, ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/models/project';
import { TimesheetService } from '../../services/timesheet.service';
import * as _ from 'lodash';
import { CommonService } from 'src/app/services/common.service';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { isNullOrUndefined } from 'util';
import * as moment from 'jalali-moment';
import { TimeEvent } from '../../models/time-event';
import { LookupValue } from 'src/app/models/lookup-value';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/user';
import { Activity } from '../../models/activity';
import { ActivityService } from '../../services/activity.service';
import { IDatePickerConfig } from 'ng2-jalali-date-picker';
import { EventType } from 'src/app/modules/general/enums/event-type.enum';
import { isNullOrEmptyString } from '@progress/kendo-angular-treelist/dist/es2015/utils';
import { OrganizationPosition } from 'src/app/modules/baseinfo/models/organization-position';
import { ProjectPosition } from 'src/app/modules/baseinfo/models/project-position';
import { TimesheetState } from 'src/app/modules/general/enums/timesheet-state.enum';
import { EventStates } from '../../models/event-states';
import { Position } from 'src/app/modules/general/enums/position.enum';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {

  isLoading: boolean;
  pageTitle: string;
  viewModel: TimeEvent;
  eventType: number;
  position: number;
  @ViewChild("projectList") projectList;
  projects: Array<Project>;
  sourceProjs: Array<Project>;
  @ViewChild("sectionLList") sectionLList;
  public sections: Array<LookupValue>
  startDate;
  endDate;
  startTime;
  endTime;
  isNew: boolean = false;
  isOwner: boolean;
  editable: boolean;
  currentUser: User;
  activity: Activity;
  datePickerConfig: IDatePickerConfig;
  orgUserRoles: OrganizationPosition[];
  projectRoles: ProjectPosition[];
  isHRUser: boolean;
  constructor(private router: Router, private route: ActivatedRoute, public timeService: TimesheetService,
    public commonService: CommonService, private authService: AuthService, private actService: ActivityService) {

    if (!isNullOrUndefined(this.router.getCurrentNavigation().extras.state)) {
      var date = this.router.getCurrentNavigation().extras.state.userDate;
      this.startDate = moment(date);
      this.endDate = moment(date);
    }
  }

  ngOnInit() {
    this.isHRUser = false;
    this.viewModel = new TimeEvent();
    this.viewModel.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.eventType = parseInt(this.route.snapshot.paramMap.get('eventType'));
    this.position = parseInt(this.route.snapshot.paramMap.get('position'));
    this.pageTitle = this.getEventTypeTitle(this.eventType);
    this.datePickerConfig = {
      // format: (this.eventType == EventType.DailyMission || this.eventType == EventType.DailyLeave) ? 'YYYY/M/D' : 'YYYY/M/D HH:mm',
      format: 'YYYY/M/D',
      showTwentyFourHours: true,
      minutesInterval: 5
    }
    this.getLookups();
    if (!_.isNaN(this.viewModel.id)) {
      this.getItem(this.viewModel.id);
      this.getCurrentUserRole();
      this.getUserOrganiyationRole();
    }
    else {
      this.isNew = true;
      this.isOwner = true;
      this.editable = true;
      this.viewModel.eventType = this.eventType;
      this.getActivity();
      this.viewModel.isAllDay = (this.eventType == EventType.DailyLeave || this.eventType == EventType.DailyMission) ? true : false;
      this.viewModel.currentStatus = 0;
      this.viewModel.title = this.getEventTypeTitle(this.eventType);
      // this.viewModel.creationJalaliDate = moment(Date.now(),'jYYYY,jMM,jDD').format('jYYYY,jMM,jDD');
    }
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.getLoggedIn().subscribe((result: any) => {
      this.currentUser = result;
      if (this.isNew)
        this.viewModel.ownerName = this.currentUser.fullname
    });
  }
  getUserOrganiyationRole() {
    this.commonService.GetUserOrganizationRolePositions().subscribe((result: any) => {
      if (result.data.some(x => x.id == Position.HumanResources))
        this.isHRUser = true;
    });
  }
  getLookups() {
    this.isLoading = true;
    this.commonService.GetUserOrganizationRole().subscribe((data: any) => {
      this.isLoading = false;
      this.sections = data.data;
      if (this.isNew && this.sections.length == 1)
        this.viewModel.organizationRole = this.sections[0];
    }, error => {
      this.isLoading = false;
    });

    this.commonService.GetAllProjects().subscribe((result: any) => {
      this.isLoading = false;
      result.data.push({
        id: "00000000-0000-0000-0000-000000000000",
        pmProjectId: 0,
        title: "General"
      })
      this.projects = this.sourceProjs = _.orderBy(result.data, ['pmProjectId'], ['asc']);
      if (this.isNew && this.projects.length == 1)
        this.viewModel.project = this.projects[0];
    }, error => {
      this.isLoading = false;
    });
  }

  getItem(id: number) {
    this.isLoading = true;
    this.timeService.getSingle('GetSingle', `${id}`).subscribe((result: any) => {
      this.isLoading = false
      this.viewModel = result.model;
      this.startDate = moment(this.viewModel.start);
      this.endDate = moment(this.viewModel.end);
      if (this.viewModel.isAllDay == false) {
        this.startTime = this.setTimeFormat(new Date(this.viewModel.start).getHours().toString(), new Date(this.viewModel.start).getMinutes().toString());
        this.endTime = this.setTimeFormat(new Date(this.viewModel.end).getHours().toString(), new Date(this.viewModel.end).getMinutes().toString());
      }
      this.isOwner = !isNullOrUndefined(this.currentUser) && this.viewModel.ownerId == this.currentUser.id;
      this.editable = this.saveAccess();
      if (this.eventType == EventType.Task || this.eventType == EventType.Activity)
        this.pageTitle = "Timesheet Activity -  " + this.viewModel.title;
    }, error => {
      this.isLoading = false;
    });
  }

  setTimeFormat(hour: string, min: string) {
    if (min.length == 1)
      min = "0" + min;

    if (hour.length == 1)
      hour = "0" + hour;
    return hour + ":" + min;
  }
  getEventTypeTitle(id) {
    if (!isNullOrUndefined(id))
      return EnumCoding.EventTypes.find((t: any) => t.id == id).title;
  }

  getActivity() {
    this.isLoading = true;
    this.actService.getSingle('ActivityByType', this.eventType.toString()).subscribe((result: any) => {
      this.isLoading = false;
      this.activity = result.model;
    });
  }

  saveEvent() {
    if (isNullOrUndefined(this.viewModel.project) || isNullOrUndefined(this.viewModel.organizationRole) || isNullOrUndefined(this.startDate)
      || (this.viewModel.isAllDay == true && isNullOrUndefined(this.endDate))) {
      alert("لطفا فیلد های اجباری را پر کنید.");
      return;
    }
    if (this.viewModel.eventType == EventType.DailyLeave && isNullOrUndefined(this.viewModel.dailyVacationType)) {
      alert("لطفا فیلد های اجباری را پر کنید.");
      return;
    }
    else if ((this.viewModel.eventType == EventType.HourlyMission || this.viewModel.eventType == EventType.DailyMission)
      && (isNullOrUndefined(this.viewModel.transportType) || isNullOrEmptyString(this.viewModel.description))) {
      alert("لطفا فیید های اجباری را پر کنید.");
      return;
    }
    if (this.viewModel.isAllDay == true && this.startDate._d > this.endDate._d) {
      alert("تاریخ شروع نمیتواند از تاریخ پایان بزرگتر باشد!");
      return;
    }

    if (this.viewModel.eventType != EventType.DailyLeave && this.viewModel.eventType != EventType.DailyMission)
      if (isNullOrEmptyString(this.startTime) || this.startTime.length < 3 || isNullOrEmptyString(this.endTime) || this.endTime.length < 3) {
        alert("لطفا ساعت و دقیقه را پر کنید!");
        return;
      }

    this.viewModel.currentStatus = TimesheetState.Registered;
    var data = this.readEvent(this.viewModel);
    if (data.isAllDay == false) {
      data.start = this.setTimeToDate(new Date(data.start), this.startTime);
      data.end = this.setTimeToDate(new Date(data.end), this.endTime);
    }
    this.isLoading = true;
    this.timeService.Post(data).subscribe(result => {
      this.isLoading = false;
      this.router.navigate([`/home/timesheet/userRequests`]);
    }, error => {
      this.isLoading = false;
      var errMessage = '';
      if (error.error.length > 0)
        error.error.forEach((err: string) => errMessage = errMessage + err + '\n');
      else
        errMessage = error.error.ExceptionMessage;
      alert(errMessage);
    });
  }

  private readEvent(item: TimeEvent): Timesheet {
    return {
      ...item,
      id: this.isNew ? 0 : item.id,
      start: new Date(this.startDate._d),
      end: this.viewModel.isAllDay == true ? new Date(this.endDate._d) : new Date(this.startDate._d), //,
      projectId: item.project.id != "00000000-0000-0000-0000-000000000000" ? item.project.id : null,
      organizationRoleId: item.organizationRole.id,
      activityId: this.isNew ? this.activity.id : item.activityId,
    };
  }
  setTimeToDate(date: Date, time: string) {
    var tmList = time.split(':');
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(tmList[0]), parseInt(tmList[1]), 0);
  }
  getTimeDuration() {

    if (!isNullOrUndefined(this.startDate) && !isNullOrUndefined(this.endDate)) {
      var filterModel = {
        isAllDay: this.viewModel.isAllDay,
        startDate: new Date(this.startDate._d),
        endDate: new Date(this.endDate._d)
      };
      this.isLoading = true;
      this.timeService.GetDateDuration(filterModel).subscribe((result: any) => {
        this.isLoading = false
        this.viewModel.duration = result;
      }, error => {
        this.isLoading = false;
      });
    }
  }

  getCurrentUserRole() {
    this.isLoading = true;
    this.timeService.GetCurrentUserOrgRoles().subscribe((result: any) => {
      this.isLoading = false
      this.orgUserRoles = result.data;
    }, error => {
      this.isLoading = false;
    });
    this.timeService.GetCurrentUserProjectRoles().subscribe((result: any) => {
      this.isLoading = false
      this.projectRoles = result.data;
    }, error => {
      this.isLoading = false;
    });
  }

  approveAccess() {
    var hasApproveRole = false;
    if (this.position != Position.HumanResources) {
      if (!isNullOrUndefined(this.orgUserRoles) && !isNullOrUndefined(this.projectRoles) && !_.isNaN(this.position)) {
        hasApproveRole = this.orgUserRoles.some(x => x.position.id == this.position);
        if (!hasApproveRole)
          hasApproveRole = this.projectRoles.some(x => x.project.id == this.viewModel.project.id && x.position.id == this.position);
      }
    }
    return !this.isNew && !this.isOwner && hasApproveRole;
  }
  saveAccess() {
    return this.isNew || (this.isOwner && (this.viewModel.eventType <= EventType.Task || this.viewModel.currentStatus == TimesheetState.Registered || this.viewModel.currentStatus == TimesheetState.Rejected));
  }

  changeState(approve: boolean) {

    var state = new EventStates()
    state.timeSheetId = this.viewModel.id;
    state.comment = this.viewModel.comment;
    switch (this.position) {
      case Position.PSL:
        state.status = approve == true ? TimesheetState.ConfirmedByPSL : TimesheetState.Rejected;
        break;
      case Position.ProjectManager:
        state.status = approve == true ? TimesheetState.ConfirmedByProjectManager : TimesheetState.Rejected;
        break;
      case Position.DepartmentManager:
        state.status = approve == true ? TimesheetState.ConfirmedByDepatrment : TimesheetState.Rejected;
        break;
      case Position.DesciplineHead:
        state.status = approve == true ? TimesheetState.ConfirmedByDesiplineHead : TimesheetState.Rejected;
        break;
      case Position.HumanResources:
        state.status = approve == true ? TimesheetState.ConfirmedByHR : TimesheetState.Rejected;;
        break;
      default:
        break;
    }
    this.isLoading = true;
    this.timeService.ChangeState(state).subscribe(result => {
      this.isLoading = false;
      this.router.navigate([`/home/timesheet/confirmEvents`]);
    }, error => {
      this.isLoading = false;
      var errMessage = '';
      if (error.error.length > 0)
        error.error.forEach((err: string) => errMessage = errMessage + err + '\n');
      else
        errMessage = error.error.ExceptionMessage;
      alert(errMessage);
    });
  }
  HRVacationCommented(approve: number) {

    var state = new EventStates()
    state.timeSheetId = this.viewModel.id;
    state.status = TimesheetState.DailyVacationHRComment;
    if (approve == 1)
      state.comment = this.viewModel.dailyVacationType == 3 ? "مرخصی استعلاجی دارد" : "مرخصی استحقاقی دارد";
    else if (approve == 2)
      state.comment = this.viewModel.dailyVacationType == 3 ? "مرخصی استعلاجی ندارد" : "مرخصی استحقاقی ندارد";
    else
      state.comment = "توافقی";
    this.isLoading = true;
    this.timeService.ChangeState(state).subscribe(result => {
      this.isLoading = false;
      this.router.navigate([`/home/timesheet/confirmEvents`]);
    }, error => {
      this.isLoading = false;
      var errMessage = '';
      if (error.error.length > 0)
        error.error.forEach((err: string) => errMessage = errMessage + err + '\n');
      else
        errMessage = error.error.ExceptionMessage;
      alert(errMessage);
    });

  }

  closeEvent() {
    if (this.isOwner == true)
      this.router.navigate([`/home/timesheet/userRequests`]);
    else
      this.router.navigate([`/home/timesheet/confirmEvents`]);
  }
}
