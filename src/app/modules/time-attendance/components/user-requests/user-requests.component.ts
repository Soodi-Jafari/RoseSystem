import { Component, OnInit, ViewChild } from '@angular/core';
import { GridDataResult, GridComponent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor, State, process } from '@progress/kendo-data-query';
import { TimesheetService } from '../../services/timesheet.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeEvent } from '../../models/time-event';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import * as _ from 'lodash';
import { Project } from 'src/app/models/project';
import { LookupValue } from 'src/app/models/lookup-value';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import * as moment from 'jalali-moment';
import { TimeSheetReport } from '../../models/time-sheet-report';
import { CommonService } from 'src/app/services/common.service';
import { Position } from 'src/app/modules/general/enums/position.enum';

@Component({
  selector: 'app-user-requests',
  templateUrl: './user-requests.component.html',
  styleUrls: ['./user-requests.component.css']
})
export class UserRequestsComponent implements OnInit {

  isLoading: boolean;
  gridView: GridDataResult;
  viewModel: any;

  @ViewChild("projectList") projectList;
  @ViewChild("userList") userList;
  @ViewChild("grid") private grid: GridComponent;
  projects: Array<Project>;
  sourceProjs: Array<Project>;
  sourceUsers: LookupValue[];
  users: LookupValue[];
  orgUsers: LookupValue[];
  fiscallYears: LookupValue[];
  shamssiMonth: any;
  deletePermision: boolean;
  allUserPermission: boolean;
  public aggregates: any[] = [{ field: 'eventTypeTitle', aggregate: 'count' }];
  groups: GroupDescriptor[] = [{
    field: 'eventTypeTitle',
    aggregates: this.aggregates
  }];
  timesheets: any[]
  public selectionRows: any[] = [];

  state: State = {
    group: this.groups
  };

  constructor(public timeService: TimesheetService, private router: Router, private route: ActivatedRoute, private authService: AuthService, public commonService: CommonService) {
    this.timesheets = [];
    this.shamssiMonth = EnumCoding.ShamssiMonth;
  }

  ngOnInit() {
    this.viewModel = {};
    this.viewModel.month = { id: moment(new Date()).jMonth() + 1 };
    this.getUserOrganiyationRole();
    this.getCurrentUser();
    this.getFiscallyears();
    this.getOrganizationUser();
    this.getAllProject();
    // setTimeout(() => {
    //   this.getEvents();
    // }, 2000);

  }
  
  getUserOrganiyationRole() {
    this.commonService.GetUserOrganizationRolePositions().subscribe((result: any) => {
      if (result.data.some(x => x.id == Position.HumanResources))
        this.allUserPermission = true;
      else
        this.allUserPermission = false;
    });
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
  getOrganizationUser() {
    this.isLoading = true;
    this.timeService.GetOrganizationUsers().subscribe((result: any) => {
      this.orgUsers = result.data;
      this.users = [];
      this.isLoading = false;
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
    if (!isNullOrUndefined(value) && !isNullOrUndefined(value.roles)) {
      this.isLoading = true;
      this.timeService.GetProjectUsers(value).subscribe((result: any) => {
        this.isLoading = false;

        this.users = [];
        //  _.forEach(this.orgUsers, (item: any) => this.users.push(item));
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

    if (isNullOrUndefined(this.viewModel.year) || isNullOrUndefined(this.viewModel.month)) {
      alert("Please enter required fields!");
      return;
    }
    if (this.viewModel.allUser == true || this.viewModel.notHR == true) {
      this.getAllEvents();
    }
    else {
      if (isNullOrUndefined(this.viewModel.user)) {
        alert("Please enter required fields!");
        return;
      }
      this.getEvents();
    }
  }

  getEvents(): void {

    this.selectionRows = [];
    if (!isNullOrUndefined(this.viewModel.user) && !isNullOrUndefined(this.viewModel.year) && !isNullOrUndefined(this.viewModel.month)) {
      var filterModel = {
        projectId: !isNullOrUndefined(this.viewModel.project) ? this.viewModel.project.id : null,
        userId: this.viewModel.user.id,
        year: this.viewModel.year.id,
        month: this.viewModel.month.id
      };

      if (this.viewModel.user.id == this.viewModel.currentUser.id)
        this.deletePermision = true;
      else
        this.deletePermision = false;
      this.isLoading = true;
      this.timeService.getListByPost('GetUserRequests', filterModel)
        .subscribe((result: any) => {
          this.isLoading = false;
          this.timesheets = result.data;
          this.setGrid();
          // this.CollapseOfferGridData();
        }, error => {
          this.isLoading = false;
        });
    }
  }

  getAllEvents(): void {

    this.selectionRows = [];
    if (!isNullOrUndefined(this.viewModel.user) && !isNullOrUndefined(this.viewModel.year) && !isNullOrUndefined(this.viewModel.month)) {
      var filterModel = {
        year: this.viewModel.year.id,
        month: this.viewModel.month.id,
        allUser: this.viewModel.allUser
      };

      this.deletePermision = false;
      this.isLoading = true;
      this.timeService.getListByPost('GetAllRequests', filterModel)
        .subscribe((result: any) => {
          this.isLoading = false;
          this.timesheets = result.data;
          this.setGrid();
          // this.CollapseOfferGridData();
        }, error => {
          this.isLoading = false;
        });
    }
  }


  allUserChange(value) {
    if (value)
      this.viewModel.notHR = false;
  }
  notHRChange(value) {
    if (value)
      this.viewModel.allUser = false;
  }

  clearNewTaskGrid() {
    this.timesheets = [];
    this.setGrid();
  }

  private setGrid(): void {
    this.gridView = process(this.timesheets, this.state);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    if (state && state.group) {
      state.group.map(group => group.aggregates = this.aggregates);
    }
    this.state = state;
    this.setGrid();
  }

  public viewEvent() {
    if (this.selectionRows.length > 0) {
      var evt = this.timesheets.find((row: any) => { return row.id == this.selectionRows[0]; });
      this.router.navigate([`/home/timesheet/eventView/${evt.eventType}/null/${evt.id}`]);
    }
    else {
      alert(`Please, Select Event`);
    }
  }

  getStateTitle(id) {
    if (!isNullOrUndefined(id))
      return EnumCoding.EventStatus.find((t: any) => t.id == id).title;
  }
  getEventTypeTitle(id) {
    if (!isNullOrUndefined(id))
      return EnumCoding.EventTypes.find((t: any) => t.id == id).title;
  }

  CollapseOfferGridData() {
    var grp = _.groupBy(this.timesheets, (item: any) => item.eventType);
    var idx = 0;
    _.forEach(grp, g => {
      this.grid.collapseGroup(idx.toString());
      idx++;
    });
  }
  getCurrentUser() {
    this.authService.getLoggedIn().subscribe((result: any) => {
      this.isLoading = false;
      this.viewModel.currentUser = result;
      this.viewModel.user = result;
    //  this.getEvents();
    });
  }
  getFiscallyears() {
    this.timeService.GetFiscallyears().subscribe((result: any) => {
      this.fiscallYears = result.data;
      this.viewModel.year = this.fiscallYears[0];
    });
  }

  deleteEvent() {
    if (this.selectionRows.length > 0) {
      var evt = this.timesheets.find((row: any) => { return row.id == this.selectionRows[0]; });
      if (confirm(`Are you sure to delete request No.  "${evt.id}"`)) {
        this.isLoading = true;
        this.timeService.Delete(evt).subscribe(result => {
          this.getEvents();
        }, error => {
          this.isLoading = false;;
          alert(`Request "${evt.id}" is used. Could not be deleted.`);
        });
      }
    }
    else {
      alert(`Please, Select Event`);
    }
  }

}

