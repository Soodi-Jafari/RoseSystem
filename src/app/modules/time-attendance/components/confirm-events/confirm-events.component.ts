import { Component, OnInit, ViewChild } from '@angular/core';
import { GridDataResult, GridComponent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor, State, process } from '@progress/kendo-data-query';
import { TimesheetService } from '../../services/timesheet.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { TimeEvent } from '../../models/time-event';
import { Position } from 'src/app/modules/general/enums/position.enum';
import { TimesheetState } from 'src/app/modules/general/enums/timesheet-state.enum';
import { EventStates } from '../../models/event-states';
import { CommonService } from 'src/app/services/common.service';
import { EventType } from 'src/app/modules/general/enums/event-type.enum';


@Component({
  selector: 'app-confirm-events',
  templateUrl: './confirm-events.component.html',
  styleUrls: ['./confirm-events.component.css']
})
export class ConfirmEventsComponent implements OnInit {

  isLoading: boolean;
  gridView: GridDataResult;
  isHRUser: boolean;
  @ViewChild("grid") private grid: GridComponent;
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

  constructor(public timeService: TimesheetService, private router: Router, private route: ActivatedRoute, public commonService: CommonService) {
    this.timesheets = [];
  }

  ngOnInit() {
    this.isHRUser = false;
    this.getUserOrganiyationRole();
    this.getEvents();
  }

  getUserOrganiyationRole() {
    this.commonService.GetUserOrganizationRolePositions().subscribe((result: any) => {
      if (result.data.some(x => x.id == Position.HumanResources))
        this.isHRUser = true;
    });
  }
  getEvents(): void {

    this.isLoading = true;
    this.timeService.getList('EventConfirmCartable')
      .subscribe((result: any) => {
        this.isLoading = false;
        this.timesheets = result.data;
        this.setGrid();
        //  this.CollapseOfferGridData();
      }, error => {
        this.isLoading = false;
      });
  }

  clearNewTaskGrid() {
    this.timesheets = [];
    this.setGrid();
  }

  private setGrid(): void {
    this.selectionRows = [];
    this.gridView = process(this.timesheets, this.state);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    if (state && state.group) {
      state.group.map(group => group.aggregates = this.aggregates);
    }
    this.state = state;
    this.setGrid();
  }

  public viewEvent(row: TimeEvent) {
    this.router.navigate([`/home/timesheet/eventView/${row.eventType}/${row.approvePosition}/${row.id}`]);
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

  changeState(approve: boolean) {
    if (this.selectionRows.length > 0) {
      if (confirm(this.setApproveMessage())) {
        var list: EventStates[] = [];
        for (const key in this.selectionRows) {
          var evt = new TimeEvent();
          evt = this.timesheets.find((row: any) => { return row.id == this.selectionRows[key]; });
          switch (evt.approvePosition) {
            case Position.PSL:
              evt.currentStatus = approve == true ? TimesheetState.ConfirmedByPSL : TimesheetState.Rejected;
              break;
            case Position.ProjectManager:
              evt.currentStatus = approve == true ? TimesheetState.ConfirmedByProjectManager : TimesheetState.Rejected;
              break;
            case Position.DepartmentManager:
              evt.currentStatus = approve == true ? TimesheetState.ConfirmedByDepatrment : TimesheetState.Rejected;
              break;
            case Position.DesciplineHead:
              evt.currentStatus = approve == true ? TimesheetState.ConfirmedByDesiplineHead : TimesheetState.Rejected;
              break;
            default:
              break;
          }
          var state = new EventStates()
          state.timeSheetId = evt.id;
          state.status = evt.currentStatus;
          list.push(state);
        };
        this.isLoading = true;
        this.timeService.BatchChangeState(list).subscribe(result => {
          this.isLoading = false;
          this.getEvents();
          this.selectionRows = [];
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
    }
    else {
      alert(`Please, Select Event`);
    }
  }
  setApproveMessage(): string {
    var rows = []
    for (const key in this.selectionRows) {
      var evt = new TimeEvent();
      evt = this.timesheets.find((row: any) => { return row.id == this.selectionRows[key]; });
      rows.push(evt);
    }

    var act = rows.filter(x => x.eventType == EventType.Activity).length;
    var task = rows.filter(x => x.eventType == EventType.Task).length;
    var daLeave = rows.filter(x => x.eventType == EventType.DailyLeave).length;
    var haLeave = rows.filter(x => x.eventType == EventType.HourlyLeave).length;
    var over = rows.filter(x => x.eventType == EventType.Overtime).length;
    var daMission = rows.filter(x => x.eventType == EventType.DailyMission).length;
    var haMission = rows.filter(x => x.eventType == EventType.HourlyMission).length;
    var message = " شما فعالیت های زیر را برای تغییر وضعیت انتخاب کرده اید: " + '\n';
    if (act > 0)
      message = message + "  اکتیویتی: " + act + '\n';
    if (task > 0)
      message = message + "  تسک: " + task + '\n';
    if (daLeave > 0)
      message = message + "  مرخصی روزانه: " + daLeave + '\n';
    if (haLeave > 0)
      message = message + "  مرخصی ساعتی: " + haLeave + '\n';
    if (over > 0)
      message = message + "  اضافه کاری: " + over + '\n';
    if (daMission > 0)
      message = message + "  مأموریت روزانه: " + daMission + '\n';
    if (haMission > 0)
      message = message + "  مأموریت ساعتی: " + haMission + '\n';

    message = message + "آیا از تغییر وضعیت آیتم ها اطمینان دارید؟"
    return message;

  }

  HRRegister(approve: boolean) {
    if (this.selectionRows.length > 0) {
      if (confirm(this.setApproveMessage())) {
        var list: EventStates[] = [];
        for (const key in this.selectionRows) {
          var evt = new TimeEvent();
          evt = this.timesheets.find((row: any) => { return row.id == this.selectionRows[key]; });
          if (approve == true && evt.currentStatus == TimesheetState.Registered) {
            alert("در لیست انتخاب شده مرخصی روزانه وجود دارد، امکان ثبت کارگزینی مقدور نمیباشد؛");
            return;
          }
          var state = new EventStates()
          state.timeSheetId = evt.id;
          state.status = approve == true ? TimesheetState.ConfirmedByHR : TimesheetState.Rejected;
          list.push(state);
        };
        this.isLoading = true;
        this.timeService.BatchChangeState(list).subscribe(result => {
          this.isLoading = false;
          this.getEvents();
          this.selectionRows = [];
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
    }
    else {
      alert(`Please, Select Event`);
    }
  }

  HRVacationCommented(approve: number) {
    if (this.selectionRows.length > 0) {
      if (confirm(this.setApproveMessage())) {
        var list: EventStates[] = [];
        for (const key in this.selectionRows) {
          var evt = new TimeEvent();
          evt = this.timesheets.find((row: any) => { return row.id == this.selectionRows[key]; });
          if ((evt.currentStatus != TimesheetState.Registered && evt.eventType == EventType.DailyLeave) || evt.eventType != EventType.DailyLeave) {
            alert("تنها انتخاب مرخصی های روزانه که ثبت اولیه شده باشند، امکان پذیر است!");
            return;
          }
          var state = new EventStates()
          state.timeSheetId = evt.id;
          state.status = TimesheetState.DailyVacationHRComment;
          if (approve == 1)
            state.comment =  "مرخصی دارد ";
          else if (approve == 2)
            state.comment =  " مرخصی ندارد ";
          else
            state.comment = "توافقی";
          list.push(state);
        };
        this.isLoading = true;
        this.timeService.BatchChangeState(list).subscribe(result => {
          this.isLoading = false;
          this.getEvents();
          this.selectionRows = [];
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
    }
    else {
      alert(`Please, Select Event`);
    }
  }

  groupCheckboxChange(cb, value) {
    if (cb.target.checked) {
      var grp = this.gridView.data.find(row => row.value == value);
      grp.items.forEach(item => {
        if (this.selectionRows.indexOf(item.id) < 0)
          this.selectionRows.push(item.id);
      });
    }
    else
    {
      var grp = this.gridView.data.find(row => row.value == value);
      grp.items.forEach(item => {
        if (this.selectionRows.indexOf(item.id) >= 0)
         _.remove(this.selectionRows, row => row == item.id);
      });
    }
  }
}

