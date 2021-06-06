import { Component, OnInit, ViewChild } from '@angular/core';
import { GridDataResult, GridComponent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { LookupValue } from 'src/app/models/lookup-value';
import { GroupDescriptor, State, process } from '@progress/kendo-data-query';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { TimesheetService } from '../../services/timesheet.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import * as moment from 'jalali-moment';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { TimeEvent } from '../../models/time-event';
import * as _ from 'lodash';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-personnelnout',
  templateUrl: './personnelnout.component.html',
  styleUrls: ['./personnelnout.component.css']
})
export class PersonnelnoutComponent implements OnInit {
  isLoading: boolean;
  gridView: GridDataResult;
  viewModel: any;
  /* 
    @ViewChild("projectList") projectList; */
  @ViewChild("userList") userList;
  @ViewChild("grid") private grid: GridComponent;
  /*  projects: Array<Project>;
   sourceProjs: Array<Project>; */
  sourceUsers: LookupValue[];
  users: LookupValue[];
  orgUsers: LookupValue[];
  fiscallYears: LookupValue[];
  shamssiMonth: any;
  /*   public aggregates: any[] = [{ field: 'eventType', aggregate: 'count' }];
    groups: GroupDescriptor[] = [{
      field: 'eventType',
      aggregates: this.aggregates
    }]; */
  userInouts: any[]
  public selectionRows: any[] = [];

  state: State = {
    //group: this.groups
  };

  constructor(public timeService: TimesheetService, private router: Router, private authService: AuthService) {
    this.userInouts = [];
    this.shamssiMonth = EnumCoding.ShamssiMonth;
  }

  ngOnInit() {
    this.viewModel = {};
    this.viewModel.month = { id: moment(new Date()).jMonth() + 1 };   
    this.getFiscallyears();
    this.getCurrentUser();
    this.getOrganizationUser();
    // this.getAllProject();
    // setTimeout(() => {
     
    // }, 2000);

  }

  ngAfterViewInit() {
    /*  const contains = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
     this.projectList.filterChange.asObservable().pipe(
       switchMap(value => from([this.sourceProjs]).pipe(
         tap(() => this.projectList.loading = true),
         delay(1000),
         map((projs) => projs.filter(contains(value)))
       ))
     )
       .subscribe(x => {
         this.projects = x;
       }); */

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
      _.forEach(this.orgUsers, (item: any) => this.users.push(item));
      this.sourceUsers = this.users;
    });
  }

  /* getAllProject() {
    this.timeService.GetAllProjects().subscribe((result: any) => {
      result.data.push({
        id: "00000000-0000-0000-0000-000000000000",
        pmProjectId: 0,
        title: "General"
      })
      this.projects = this.sourceProjs = _.orderBy(result.data, ['pmProjectId'], ['asc']);
    });
  } */

  /*  public projectSelectionChange(value: Project): void {
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
   } */

  /*  filter() {
     if (isNullOrUndefined(this.viewModel.user) || isNullOrUndefined(this.viewModel.year) || isNullOrUndefined(this.viewModel.month)) {
       alert("Please enter required fields!");
       return;
     }
     this.getEvents();
   }
  */
  getAttendance(): void {

    /* var filterModel = {
    //  projectId: !isNullOrUndefined(this.viewModel.project) ? this.viewModel.project.id : null,
      userId: this.viewModel.user.name,
      year: this.viewModel.year.id,
      month: this.viewModel.month.id
    }; */
    if (!isNullOrUndefined(this.viewModel.user) && !isNullOrUndefined(this.viewModel.year) && !isNullOrUndefined(this.viewModel.month)) {
      this.isLoading = true;
      this.timeService.getUserAttendance(`${this.viewModel.user.name}/${this.viewModel.year.id}/${this.viewModel.month.id}`)
        .subscribe((result: any) => {
          this.isLoading = false;
          this.userInouts = result.data;
          this.setGrid();
        }, error => {
          this.isLoading = false;
        });
    }
  }

  clearNewTaskGrid() {
    this.userInouts = [];
    this.setGrid();
  }

  private setGrid(): void {
    this.gridView = process(this.userInouts, this.state);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    /* if (state && state.group) {
      state.group.map(group => group.aggregates = this.aggregates);
    } */
    this.state = state;
    this.setGrid();
  }

  public addEvent(type: number) {

    if (this.selectionRows.length > 0) {
      var item = this.userInouts.find((row: any) => { return row.id == this.selectionRows[0]; });
      this.router.navigateByUrl(`/home/timesheet/eventView/${type}/null/null`, { state: { userDate:item.userDate} });
    }
    else
      this.router.navigate([`/home/timesheet/eventView/${type}/null/null`]);
  }

  getCurrentUser() {
    this.authService.getLoggedIn().subscribe((user: User) => {
      this.isLoading = false;
      this.viewModel.user = { id: user.id, title: user.fullname, name: user.code };
      this.getAttendance();
    });
  }
  getFiscallyears() {
    this.timeService.GetFiscallyears().subscribe((result: any) => {
      this.fiscallYears = result.data;
      this.viewModel.year = this.fiscallYears[0];
    });
  }
}

