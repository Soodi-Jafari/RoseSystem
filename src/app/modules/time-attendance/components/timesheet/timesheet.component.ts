import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { LookupValue } from 'src/app/models/lookup-value';
import { TimesheetService } from '../../services/timesheet.service';
import { switchMap, tap, delay, map, filter } from 'rxjs/operators';
import { from } from 'rxjs';
import { Project } from 'src/app/models/project';
import * as _ from 'lodash';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/activity';
import { SelectableSettings } from '@progress/kendo-angular-treelist';
import { isNullOrUndefined } from 'util';
import { PlannedTask } from 'src/app/modules/task/models/planned-task';
import { PlannedTaskService } from 'src/app/modules/task/services/planned-task.service';
import { CommonService } from 'src/app/services/common.service';
import * as $ from 'jquery';
window['$'] = window['jQuery'] = $;
import '@progress/kendo-ui';
import { Timesheet } from '../../models/timesheet';
import { EventType } from 'src/app/modules/general/enums/event-type.enum';
import { TimesheetState } from 'src/app/modules/general/enums/timesheet-state.enum';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-timesheet',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  isLoading: boolean;
  @ViewChild("sectionLList") sectionLList;

  public sourcePos: Array<LookupValue>;
  public sections: Array<LookupValue>;
  public orgSections: Array<LookupValue>;
  section: LookupValue;
  project: Project;
  activity: Activity;
  task: PlannedTask;

  @ViewChild("projectList") projectList;
  projects: Array<Project>;
  sourceProjs: Array<Project>;
  activities: Activity[];
  allActivities: Activity[];
  sectionActivities: Activity[];
  userInOutList: any[];
  dayUserInOut: any;
  isDayView: boolean;
  selectedDateJalali: string;
  public selected: any[] = [];
  public settings: SelectableSettings = {
    mode: 'row',
    multiple: false,
    enabled: true,
    drag: false
  };

  tasks: PlannedTask[]

  constructor(public timeService: TimesheetService, private activityService: ActivityService,
    public taskService: PlannedTaskService, public commonService: CommonService) {
  }

  ngOnInit() {
    this.isDayView = true;
    this.userInOutList = [];
    this.dayUserInOut = [];
    this.getAllActivities();
    this.getLookups();
    this.selectedDateJalali = "";
  }

  getLookups() {
    this.isLoading = true;
    this.commonService.GetUserOrganizationRole().subscribe((data: any) => {
      this.isLoading = false;
      this.orgSections = data.data;
      this.sections = this.sourcePos = this.orgSections;
      if (this.sections.length == 1) {
        this.section = this.sections[0];
        this.getSectionActivities(this.section.id);
      }
    }, error => {
      this.isLoading = false;
    });

    this.commonService.GetAllProjects().subscribe((result: any) => {
      result.data.push({
        id: "00000000-0000-0000-0000-000000000000",
        pmProjectId: 0,
        title: "General"
      })
      this.projects = this.sourceProjs = _.orderBy(result.data, ['pmProjectId'], ['asc']);
      if (this.projects.length == 1) {
        this.project = this.projects[0];
      }
    });
  }

  ngAfterViewInit() {
    const secContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    this.sectionLList.filterChange.asObservable().pipe(
      switchMap(value => from([this.sourcePos]).pipe(
        tap(() => this.sectionLList.loading = true),
        delay(1000),
        map((items) => items.filter(secContain(value)))
      ))
    )
      .subscribe(x => {
        this.sections = x;
      });

    this.configKendojs(this);
  }

  configKendojs(_that) {
    var startDate = new Date();
    var endDate = new Date();
    $("#scheduler").kendoScheduler({
      date: new Date(),
      showWorkHours: false,
      // timezone: "Asia/Tehran",
      startTime: new Date(new Date().toLocaleDateString() + " 07:00"),
      height: 550,
      views: ["day"],
      editable: {
        template: $("#customEditorTemplate").html(),
      },
      eventTemplate: $("#event-template").html(),
      dataBound: function (e) {
        _that.selectedDateJalali = moment((e.sender.view().startDate()).toString()).format('jYYYY,jMM,jDD');
        if (e.sender._selectedViewName == "day")
          _that.isDayView = true;
        else
          _that.isDayView = false;
        createDropArea(this);
        if (startDate != e.sender.view().startDate() && endDate != e.sender.view().endDate()) {
          startDate = e.sender.view().startDate();
          endDate = e.sender.view().endDate();
          _that.dayUserInOut = [];
          _that.timeService.GetUserInOuts({ startDate: startDate.toDateString(), endDate: endDate.toDateString() }).subscribe((result: any) => {
            _that.userInOutList = result.data;
            _that.dayUserInOut = _that.userInOutList.length == 1 ? _that.userInOutList[0].userTimes : [];
          });
          this.dataSource.read({ startDate: startDate.toDateString(), endDate: endDate.toDateString() })
        }

        setEventColor(this);
      },
      save: function (e) {
        var scheduler = $("#scheduler").getKendoScheduler();
        var data = _.filter(scheduler.dataSource._data, x => x.id != e.event.id)
        if (_that.chechOverlapActivities(e.event.start, e.event.end, e.event.eventType, data)) {
          alert("بازه انتخاب شده با فعالیت دیگر هم پوشانی دارد. ");
          e.preventDefault();
          this.dataSource.read({ startDate: this.startDate, endDate: this.endDate })
        }
        else if (e.event.currentStatus > 0 && (e.event.eventType > 2) && e.event.currentStatus != 6) {
          alert("در خواست مربوطه وارد مراحل تایید شده است. امکان ویرایش وجود ندارد!");
          e.preventDefault();
        }
        else if (e.event.eventType == 7 && e.event.dailyVacationType == 0) {
          alert("Please select Vacation Type!");
          e.preventDefault();
        }
        else if ((e.event.eventType == 3 || e.event.eventType == 4) && (e.event.transportType == 0 || e.event.description == "")) {
          alert("Please select Transport Type and Fill Description!");
          e.preventDefault();
        }
        else if (_that.isValidDuration(e.event.start, e.event.end, e.event.eventType) == false) {
          alert("بازه انتخاب شده خارج از محدوده حضور شما در شرکت است، لطفا بازه درست را انتخاب کنید");
          e.preventDefault();
          this.dataSource.read({ startDate: this.startDate, endDate: this.endDate })
        }
        else {
          _that.saveEvent(e.event, this.startDate, this.endDate);
        }
      },
      dataSource: {
        transport: {
          read: function (e) {
            _that.timeService.getListByPost("GetUserTimesheet", { startDate: startDate.toDateString(), endDate: endDate.toDateString() }).subscribe((result: any) => {
              e.success(result.data);
            });

          },

          update: function (e) { _that.saveEvent(e.data, startDate, endDate); },
          destroy: function (e) { _that.deleteEvent(e.data, startDate, endDate); },
          create: function (e) { e.success(); }
        },
        schema: {
          model: {
            id: "id",
            fields: {
              id: { type: "number" },
              title: { type: "string" },
              description: { type: "string" },
              start: { type: "date" },
              end: { type: "date" },
              eventType: {},
              dailyVacationType: { type: "number" },
              transportType: { type: "number" }
            }
          }
        }
      },
      resources: [
        {
          field: "eventType",
          title: "Event Type",
          dataSource: [
            { text: "Activity", value: 1, color: "#1a8cff" },
            { text: "Task", value: 2, color: "#ffb380" },
            { text: "Hourly Mission", value: 3, color: "#c6538c" },
            { text: "Daily Mission", value: 4, color: "#c6538c" },
            { text: "Overtime", value: 5, color: "#00b3b3" },
            { text: "Hourly Vacation", value: 6, color: "#b366cc" },
            { text: "Daily Vacation", value: 7, color: "#b366cc" }
          ]
        }
      ]
    }).data("kendoScheduler");

    $("#scheduler").on("dblclick", function (e) {
      var scheduler = $("#scheduler").getKendoScheduler();
      var slot = scheduler.slotByElement(e.target);
      var events = scheduler.occurrencesInRange(slot.startDate, slot.endDate);
      // var uid = scheduler.wrapper.find(".k-event").data("uid");
      // var event = scheduler.occurrenceByUid(uid);
      var event = _.filter(events, x => x.id == 0).length > 0 ? _.filter(events, x => x.id == 0)[0] : null;
      if (!isNullOrUndefined(event) && event.id == 0) {
        var taskItem, actItem;
        if (treeActivity.select().length)
          actItem = treeActivity.dataItem(treeActivity.select());
        if (grid.select().length)
          taskItem = grid.dataItem(grid.select());
        if ((isNullOrUndefined(_that.project) || isNullOrUndefined(_that.section)) || (isNullOrUndefined(actItem) && isNullOrUndefined(taskItem))) {
          alert("Please select project and section and activity Or task!");
          scheduler.cancelEvent();
        }
        else {
          if (!isNullOrUndefined(taskItem) && !isNullOrUndefined(actItem)) {
            if (!(actItem.activityType == 5 || actItem.activityType == 1))
              taskItem = undefined;
          }
          event.id = 0;
          event.currentStatus = 0;
          event.title = _that.setEventTitle(taskItem, actItem)
          event.isAllDay = actItem && (actItem.activityType == 4 || actItem.activityType == 7) ? true : false;
          event.projectId = _that.project.id != "00000000-0000-0000-0000-000000000000" ? _that.project.id : null;
          event.organizationRoleId = _that.section.id;
          event.description = !isNullOrUndefined(actItem) && actItem.activityType == 5 && !isNullOrUndefined(taskItem) ? taskItem.documentNo : "",
            event.activityId = !isNullOrUndefined(actItem) ? actItem.id : null;
          event.taskId = !isNullOrUndefined(taskItem) ? taskItem.id : null;
          event.eventType = !isNullOrUndefined(taskItem) && (isNullOrUndefined(actItem) || actItem.activityType != 5) ? 2 : actItem.activityType
          scheduler.cancelEvent();
          setTimeout(() => {
            scheduler.addEvent(event)
          }, 500);
        }
      }
    });

    var grid = $("#grid").kendoGrid({
      dataSource: {
        data: [],
        schema: {
          model: {
            id: "id",
            fields: {
              id: { type: "number" },
              documentNo: { type: "string" },
              disciplineName: { type: "string" },
              timesheetHaur: { type: "string" }
            }
          }
        },
        pageSize: 17
      },
      height: 550,
      scrollable: true,
      selectable: true,
      sortable: true,
      filterable: true,
      pageable: {
        input: true,
        numeric: false
      },
      columns: [
        { field: "documentNo", title: "Subject", width: "170px" },
        { field: "disciplineName", title: "Discipline", width: "110px", filterable: false },
        { field: "estimateManHour", title: "Pln", width: "40px", filterable: false },
        { field: "timesheetHaur", title: "Act", width: "40px", filterable: false },
        {
          field: "taskType", title: "Task Type", width: "120px",
          template: function (dataItem) {
            if (dataItem.taskType == 2)
              return "Planned Task";
            else if (dataItem.taskType == 15)
              return "IDC";
            else if (dataItem.taskType == 1)
              return "Comment";
          }
        },
        { field: "description", title: "Description", width: "350px", filterable: false },
        { field: "revision", title: "Rev.", width: "70px", filterable: false },
      ]
    }).data("kendoGrid");

    var treeActivity = $("#actTreeView").kendoTreeList({
      columns: [
        { field: "title", title: "Title" },
      ],
      selectable: true,
      dragAndDrop: true,
      height: 550,
      scrollable: true,
      filterable: true,
      dataSource: {
        schema: {
          model: {
            id: "id",
            parentId: "parentId",
            fields: {
              id: { type: "number" },
              parentId: { type: "number", nullable: true },
              activity: {},
              title: { type: "string" },
            }
          }
        },
        data: []
      }
    }).data("kendoTreeList");

    function createDropArea(scheduler) {
      scheduler.view().content.kendoDropTargetArea({
        filter: ".k-scheduler-table td, .k-event",
        drop: function (e) {
          if (scheduler._selectedViewName == "month")
            return;
          var offset = $(e.dropTarget).offset();
          var slot = scheduler.slotByPosition(offset.left, offset.top);
          var taskItem, actItem;
          if (treeActivity.select().length)
            actItem = treeActivity.dataItem(treeActivity.select());
          if (grid.select().length)
            taskItem = grid.dataItem(grid.select());

          if ((taskItem || actItem) && slot) {
            if ((isNullOrUndefined(_that.project) || isNullOrUndefined(_that.section))) {
              alert("Please select project and section");
              return;
            }

            if (!isNullOrUndefined(taskItem) || (!isNullOrUndefined(actItem) && (actItem.activityType == 1 || actItem.activityType == 5))) {
              var res = _that.setActivityDate(slot.startDate, slot.endDate, taskItem ? 2 : actItem.activityType, scheduler.dataSource._data)
              if (res.isOverlap == true) {
                alert("بازه انتخاب شده با فعالیت دیگر هم پوشانی دارد. ");
                return;
              }
              slot.startDate = res.start;
              slot.endDate = res.end;
            }
            else if (!isNullOrUndefined(actItem) && actItem.activityType == 6) {
              var res = _that.setHourlyVacitionDate(slot.startDate, slot.endDate)
              slot.startDate = res.start;
              slot.endDate = res.end;
            }
            else if (!isNullOrUndefined(actItem) && actItem.activityType == 3) {
              var res = _that.setHourlyMissionDate(slot.startDate, slot.endDate)
              slot.startDate = res.start;
              slot.endDate = res.end;
            }

            if (_that.isValidDuration(slot.startDate, slot.endDate, taskItem ? 2 : actItem.activityType) == false) {
              var cd = _that.userInOutList.filter(x => (new Date(x.userDate)).toString() == (new Date(slot.startDate.getFullYear(), slot.startDate.getMonth(), slot.startDate.getDate(), 0, 0, 0)).toString());
              var times = cd[0].userTimes;
              var errMessage = "بازه انتخاب شده خارج از محدوده حضور شما در شرکت است، لطفا بازه درست را انتخاب کنید" + '\n';
              for (var idx = 0; idx < times.length; idx++) {
                errMessage = errMessage + ((idx % 2) == 0 ? "ورود:  " : "خروج: ") + _that.setTimeFormat(times[idx]) + '\n';
              }
              alert(errMessage);
              return;
            }

            if (!isNullOrUndefined(taskItem) && !isNullOrUndefined(actItem)) {
              if (!(actItem.activityType == 5 || actItem.activityType == 1))
                taskItem = undefined;
            }

            var newEvent = {
              title: _that.setEventTitle(taskItem, actItem),
              end: slot.endDate,
              start: slot.startDate,
              isAllDay: actItem && (actItem.activityType == 4 || actItem.activityType == 7) ? true : false,
              projectId: _that.project.id != "00000000-0000-0000-0000-000000000000" ? _that.project.id : null,
              organizationRoleId: _that.section.id,
              description: !isNullOrUndefined(actItem) && actItem.activityType == 5 && !isNullOrUndefined(taskItem) ? taskItem.documentNo : "",
              activityId: !isNullOrUndefined(actItem) ? actItem.id : null,
              taskId: !isNullOrUndefined(taskItem) ? taskItem.id : null,
              eventType: !isNullOrUndefined(taskItem) && (isNullOrUndefined(actItem) || actItem.activityType != 5) ? 2 : actItem.activityType
            };

            if (newEvent.eventType == 5 || newEvent.eventType == 4 || newEvent.eventType == 3 || newEvent.eventType == 7)
              scheduler.addEvent(newEvent);
            else
              _that.saveEvent(newEvent, this.startDate, this.endDate);
          }
        }
      });
    }

    grid.table.kendoDraggable({
      filter: "tbody > tr",
      dragstart: function (e) {
        // treeActivity.clearSelection();
        var gridRowOffset = grid.tbody.find("tr:first").offset();
        $("#dragTooltip").css("margin-left", e.clientX - gridRowOffset.left - 50);
      },
      hint: function (row) {
        // Remove the old selection.
        row.parent().find(".k-state-selected").each(function () {
          $(this).removeClass("k-state-selected")
        })

        // Add the selected class to the current row.
        row.addClass("k-state-selected");

        var dataItem = grid.dataItem(row);
        var tooltipHtml = "<div class='k-event' id='dragTooltip'><div class='k-event-template'>" +
          // kendo.format("{0:t} - {1:t}", dataItem.start, dataItem.end) +
          "</div><div class='k-event-template'>" + dataItem.documentNo +
          "</div></div>";

        return $(tooltipHtml).css("width", 300);
      }
    });

    treeActivity.table.kendoDraggable({
      filter: "tbody > tr",
      dragstart: function (e) {
        // grid.clearSelection();
        var gridRowOffset = treeActivity.tbody.find("tr:first").offset();
        // Add a margin to position correctly the tooltip under the pointer.
        $("#dragTooltip").css("margin-left", e.clientX - gridRowOffset.left - 50);
      },
      hint: function (row) {
        // Remove the old selection.
        row.parent().find(".k-state-selected").each(function () {
          $(this).removeClass("k-state-selected")
        })

        // Add the selected class to the current row.
        row.addClass("k-state-selected");

        var dataItem = treeActivity.dataItem(row);
        var tooltipHtml = "<div class='k-event' id='dragTooltip'><div class='k-event-template'>" +
          "</div><div class='k-event-template'>" + dataItem.title +
          "</div></div>";

        return $(tooltipHtml).css("width", 300);
      }
    });

    function setEventColor(_this) {
      var view = _this.view();
      var events = _this.dataSource.view();
      var eventElement;
      var event;
      for (var idx = 0, length = events.length; idx < length; idx++) {
        event = events[idx];
        eventElement = view.element.find("[data-uid=" + event.uid + "]");
        eventElement.css("background-color", getColor(event));
      }
    }

    function getColor(event) {
      if (event.currentStatus == 6)
        return "#ff0000";
    }
  }

  setEventTitle(taskItem, actItem) {
    var title = ""
    if (!isNullOrUndefined(taskItem) && isNullOrUndefined(actItem)) {
      if (taskItem.taskType == 2) {  // prepare document
        actItem = { id: 279 };
        title = "Document - Prepare - "
      }
      else if (taskItem.taskType == 15)  // prepare IDC
      {
        actItem = { id: 389 }
        title = "IDC - Prepare - "
      }
      else if (taskItem.taskType == 1)  // prepare Comment
      {
        actItem = { id: 287 }
        title = "Comment - Prepare - "
      }
      title = title + taskItem.documentNo;
    }
    else if (!isNullOrUndefined(taskItem) && !isNullOrUndefined(actItem) && actItem.activityType <= 2) {
      title = (actItem.activity.id > 0 ? actItem.activity.title + " - " : "") + actItem.title + " - " + taskItem.documentNo;
    }
    else {
      title = (actItem.activity.id > 0 ? actItem.activity.title + " - " : "") + actItem.title;
    }
    return title;
  }

  isValidDuration(sd: Date, ed: Date, type: number) {
    var cd = this.userInOutList.filter(x => (new Date(x.userDate)).toString() == (new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), 0, 0, 0)).toString());
    if (cd.length > 0) {
      var times = cd[0].userTimes;
      var st = parseInt(sd.getHours().toString() + (sd.getMinutes().toString().length == 1 ? "0" : "") + sd.getMinutes().toString());
      var et = parseInt(ed.getHours().toString() + (ed.getMinutes().toString().length == 1 ? "0" : "") + ed.getMinutes().toString());
      if (type == EventType.Activity || type == EventType.Task || type == EventType.Overtime) {
        for (let i = 0; i < times.length; i++) {
          if (st < times[i] && et > times[i])
            return false;
          else if (i == 0 && st < times[i] && et < times[i])   //  befor first enter
            return false;
          else if (i == times.length - 1 && i % 2 == 1 && st > times[i] && et > times[i])   // after last exit
            return false;
          else if (i > 0 && i % 2 == 0 && st >= times[i - 1] && st <= times[i] && et > times[i - 1] && et <= times[i])
            return false;
        }
      }
      return true;
    }
  }

  setActivityDate(sd: Date, ed: Date, type: number, dataSource: any[]) {
    var newStart;
    var newEnd;
    var preAct;
    var afterAct;
    if (dataSource.length > 0) {
      for (const key in dataSource) {
        if (dataSource[key].eventType != EventType.DailyLeave && dataSource[key].eventType != EventType.DailyMission)
          if ((sd >= dataSource[key].start && sd < dataSource[key].end) || (ed > dataSource[key].start && ed <= dataSource[key].end))
            return { isOverlap: true }
      }

      var list = _.orderBy(dataSource, x => x.start);
      preAct = _.last(_.orderBy(list.filter(x => x.start < sd), x => x.start));
      afterAct = _.first(_.orderBy(list.filter(x => x.start > sd), x => x.start));
      var paEnd = !isNullOrUndefined(preAct) ? parseInt(preAct.end.getHours().toString() + (preAct.end.getMinutes().toString().length == 1 ? "0" : "") + preAct.end.getMinutes().toString()) : 0;
      var aaStart = !isNullOrUndefined(afterAct) ? parseInt(afterAct.start.getHours().toString() + (afterAct.start.getMinutes().toString().length == 1 ? "0" : "") + afterAct.start.getMinutes().toString()) : 0;
    }
    var cd = this.userInOutList.filter(x => (new Date(x.userDate)).toString() == (new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), 0, 0, 0)).toString());
    if (cd.length > 0) {
      var times = cd[0].userTimes;
      var st = parseInt(sd.getHours().toString() + (sd.getMinutes().toString().length == 1 ? "0" : "") + sd.getMinutes().toString());
      var et = parseInt(ed.getHours().toString() + (ed.getMinutes().toString().length == 1 ? "0" : "") + ed.getMinutes().toString());
      for (let i = 0; i < times.length; i++) {
        if (i % 2 == 0) {
          if (times.length % 2 == 0 && ((st >= times[i] && st < times[i + 1]) || (st < times[i] && et > times[i + 1]))) {
            if (!isNullOrUndefined(preAct) && paEnd > times[i] && paEnd < times[i + 1])
              newStart = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), preAct.end.getHours(), preAct.end.getMinutes(), 0);
            else
              newStart = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), Math.floor(times[i] / 100), times[i] % 100, 0);
            if (!isNullOrUndefined(afterAct) && aaStart > times[i] && aaStart < times[i + 1])
              newEnd = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), afterAct.start.getHours(), afterAct.start.getMinutes(), 0);
            else
              newEnd = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), Math.floor(times[i + 1] / 100), times[i + 1] % 100, 0);
            return { isOverlap: false, start: newStart, end: newEnd };
          }
          else if (i == times.length - 1 && times.length % 2 == 1 && st > times[i]) {
            if (!isNullOrUndefined(preAct) && paEnd > times[i])
              newStart = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), preAct.end.getHours(), preAct.end.getMinutes(), 0);
            else
              newStart = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), Math.floor(times[i] / 100), times[i] % 100, 0);
            if (!isNullOrUndefined(afterAct) && aaStart > times[i])
              newEnd = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), afterAct.start.getHours(), afterAct.start.getMinutes(), 0);
            else
              newEnd = ed;
            return { isOverlap: false, start: newStart, end: newEnd };
          }
        }
      }
    }
    return { isOverlap: false, start: sd, end: ed };
  }

  setHourlyVacitionDate(sd: Date, ed: Date) {
    var newStart;
    var newEnd;
    var cd = this.userInOutList.filter(x => (new Date(x.userDate)).toString() == (new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), 0, 0, 0)).toString());
    if (cd.length > 0) {
      var times = cd[0].userTimes;
      var st = parseInt(sd.getHours().toString() + (sd.getMinutes().toString().length == 1 ? "0" : "") + sd.getMinutes().toString());
      var et = parseInt(ed.getHours().toString() + (ed.getMinutes().toString().length == 1 ? "0" : "") + ed.getMinutes().toString());
      for (let i = 0; i < times.length; i++) {
        if (i == 0 && st < times[i]) {
          newStart = sd;
          newEnd = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), Math.floor(times[i] / 100), times[i] % 100, 0);
          return { start: newStart, end: newEnd };
        }
        else if (i == times.length - 1 && i % 2 == 1 && st > times[i] && st < 1630)   // after last exit
        {
          newStart = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), Math.floor(times[i] / 100), times[i] % 100, 0);
          newEnd = ed
          return { start: newStart, end: newEnd };
        }
        else if (i > 1 && i % 2 == 0 && ((st > times[i - 1] && st < times[i]) || (ed > times[i - 1] && ed < times[i]) || (st < times[i - 1] && ed > times[i]))) {
          newStart = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), Math.floor(times[i - 1] / 100), times[i - 1] % 100, 0);
          newEnd = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), Math.floor(times[i] / 100), times[i] % 100, 0);
          return { start: newStart, end: newEnd };
        }
      }
    }
    return { start: sd, end: ed };
  }

  setHourlyMissionDate(sd: Date, ed: Date) {
    var newStart;
    var newEnd;
    var cd = this.userInOutList.filter(x => (new Date(x.userDate)).toString() == (new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), 0, 0, 0)).toString());
    if (cd.length > 0) {
      var times = cd[0].userTimes;
      var st = parseInt(sd.getHours().toString() + (sd.getMinutes().toString().length == 1 ? "0" : "") + sd.getMinutes().toString());
      var et = parseInt(ed.getHours().toString() + (ed.getMinutes().toString().length == 1 ? "0" : "") + ed.getMinutes().toString());
      for (let i = 0; i < times.length; i++) {
        if (i == 0 && st < times[i]) {
          newStart = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), 7, 30, 0)
          newEnd = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), Math.floor(times[i] / 100), times[i] % 100, 0);
          return { start: newStart, end: newEnd };
        }
        else if (i == times.length - 1 && i % 2 == 1 && st > times[i] && st < 1630)   // after last exit
        {
          newStart = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), Math.floor(times[i] / 100), times[i] % 100, 0);
          newEnd = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), 16, 30, 0);
          return { start: newStart, end: newEnd };
        }
        else if (i > 1 && i % 2 == 0 && ((st > times[i - 1] && st < times[i]) || (ed > times[i - 1] && ed < times[i]) || (st < times[i - 1] && ed > times[i]))) {
          newStart = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), Math.floor(times[i - 1] / 100), times[i - 1] % 100, 0);
          newEnd = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), Math.floor(times[i] / 100), times[i] % 100, 0);
          return { start: newStart, end: newEnd };
        }
      }
    }
    return { start: sd, end: ed };
  }

  chechOverlapActivities(sd: Date, ed: Date, type: number, dataSource: any[]) {
    if (dataSource.length > 0) {
      for (const key in dataSource) {
        if (type != EventType.DailyLeave && dataSource[key].eventType != EventType.DailyLeave &&
          type != EventType.DailyMission && dataSource[key].eventType != EventType.DailyMission)
          if ((sd > dataSource[key].start && sd < dataSource[key].end) || (ed > dataSource[key].start && ed <= dataSource[key].end))
            return true;
      }
    }
    return false;
  }

  public projectSelectionChange(value: Project): void {
    this.section = undefined;
    if (!isNullOrUndefined(value)) {
      this.getPlannedTasks(value);
      // this.filterActivities(value);
      var projSections = [];
      if (!isNullOrUndefined(value.roles)) {
        value.roles.forEach(elmt => {
          if (elmt.disciplineId > 0 && !projSections.some(x => x.id == elmt.disciplineId)) {
            var n = new LookupValue();
            n.id = elmt.disciplineId;
            n.title = elmt.disciplineName;
            projSections.push(n);
          }
        });
      }
      this.sections = this.sourcePos = projSections.length > 0 ? projSections : this.orgSections;
      if (this.sections.length == 1) {
        this.section = this.sections[0];
        this.getSectionActivities(this.section.id)
      }
      else
        this.setMainActivity();
    }
    else {
      this.clearNewTaskGrid();
      this.getAllActivities();
      this.sections = this.sourcePos = this.orgSections;
      if (this.sections.length == 1) {
        this.section = this.sections[0];
        this.getSectionActivities(this.section.id)
      }
    }
  }

  getAllActivities(): void {
    this.isLoading = true;
    this.activityService.getList("GetAll").subscribe((result: any) => {
      this.isLoading = false;
      this.allActivities = result.data;
      this.setMainActivity();
    });
  }

  getSectionActivities(sectionId: number): void {
    // this.isLoading = true;
    this.activityService.getList("SectionActivities", `${sectionId}`).subscribe((result: any) => {
      // this.isLoading = false;
      this.sectionActivities = result.data;
      var childActivities: Activity[] = [];
      if (isNullOrUndefined(this.project) || this.project.pmProjectId == 0)
        childActivities = this.allActivities.filter(f => f.isMain == true).concat(this.sectionActivities.filter(f => f.noneProjectize == true));
      else
        childActivities = this.allActivities.filter(f => f.isMain == true).concat(this.sectionActivities.filter(f => f.isProjectize == true));
      var parents = this.allActivities.filter(f => _.some(childActivities, ['parentId', f.id]));
      this.activities = _.orderBy(childActivities.concat(parents), x => x.activityType, "desc");
      $("#actTreeView").data("kendoTreeList").dataSource.data(this.activities);
    });
  }

  sectionSelectionChange(value: LookupValue): void {
    if (!isNullOrUndefined(value))
      this.getSectionActivities(value.id);
    else
      this.setMainActivity();
  }

  setMainActivity() {
    var childActivities = this.allActivities.filter(f => f.isMain == true);
    var parents = this.allActivities.filter(f => _.some(childActivities, ['parentId', f.id]));
    this.activities = _.orderBy(childActivities.concat(parents), x => x.activityType, "desc");
    $("#actTreeView").data("kendoTreeList").dataSource.data(this.activities);
  }

  /* filterActivities(project: Project) {
    var childActivities: Activity[] = [];
    if (project.pmProjectId == 0)
      childActivities = this.allActivities.filter(f => f.isMain == true || f.noneProjectize);
    else
      childActivities = this.allActivities.filter(f => f.isMain == true || f.isProjectize ||
        (project.isTender == true && f.isForTender == true) || (project.isFeasibility == true && f.isForFeasibility == true));

    var parents = this.allActivities.filter(f => _.some(childActivities, ['parentId', f.id]));
    this.activities = _.orderBy(childActivities.concat(parents), x => x.activityType, "desc");
    $("#actTreeView").data("kendoTreeList").dataSource.data(this.activities);
  } */

  saveEvent(model: Timesheet, start, end) {
    this.isLoading = true;
    model.currentStatus = TimesheetState.Registered;
    this.timeService.Post(model).subscribe(result => {
      this.isLoading = false;
      $("#scheduler").data("kendoScheduler").dataSource.read({ startDate: start, endDate: end });
      if (!isNullOrUndefined(model.taskId))
        this.getPlannedTasks(this.project);
      this.clearSelection();
    }, error => {
      this.isLoading = false;
      $("#scheduler").data("kendoScheduler").dataSource.read({ startDate: start, endDate: end });
      var errMessage = '';
      if (error.error.length > 0)
        error.error.forEach((err: string) => errMessage = errMessage + err + '\n');
      else
        errMessage = error.error.ExceptionMessage;
      this.clearSelection();
      alert(errMessage);
    });

  }
  deleteEvent(model: Timesheet, start, end) {
    this.isLoading = true;
    this.timeService.Delete(model).subscribe(result => {
      this.isLoading = false;
      if (!isNullOrUndefined(model.taskId))
        this.getPlannedTasks(this.project);
      $("#scheduler").data("kendoScheduler").dataSource.read({ startDate: start, endDate: end });
    }, error => {
      this.isLoading = false;
      $("#scheduler").data("kendoScheduler").dataSource.read({ startDate: start, endDate: end });
      var errMessage = '';
      if (error.error.length > 0)
        error.error.forEach((err: string) => errMessage = errMessage + err + '\n');
      else
        errMessage = error.error.ExceptionMessage;

      alert(errMessage);
    });
  }

  getPlannedTasks(project: Project): void {
    if (!isNullOrUndefined(project)) {
      this.isLoading = true;
      this.taskService.getListByPost('ProjectPerRoleIdcAndTasks', project)
        .subscribe((result: any) => {
          this.isLoading = false;
          this.tasks = result.data;
          $("#grid").data("kendoGrid").dataSource.data(this.tasks);
        }, error => {
          this.isLoading = false;
        });
    }
    else {
      this.clearNewTaskGrid();
    }
  }

  clearSelection() {
    $("#grid").data("kendoGrid").clearSelection();
    $("#actTreeView").data("kendoTreeList").clearSelection();
  }
  clearNewTaskGrid() {
    this.tasks = [];
    $("#grid").data("kendoGrid").dataSource.data(this.tasks);
  }
  setTimeFormat(time: number) {
    var x = (time.toString().length == 3 ? "0" : "") + Math.floor(time / 100).toString() + ":" + ((time % 100).toString().length == 1 ? "0" : "") + (time % 100).toString();
    return x;
  }

}
