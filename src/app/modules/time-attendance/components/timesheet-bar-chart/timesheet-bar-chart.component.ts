import { Component, OnInit } from '@angular/core';
import { TimesheetService } from '../../services/timesheet.service';
import { CommonService } from 'src/app/services/common.service';
import { isNullOrUndefined } from 'util';
import { TimeSheetReport } from '../../models/time-sheet-report';
import * as _ from 'lodash';
import { groupBy } from '@progress/kendo-data-query';
import { LookupValue } from 'src/app/models/lookup-value';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';

@Component({
  selector: 'app-timesheet-bar-chart',
  templateUrl: './timesheet-bar-chart.component.html',
  styleUrls: ['./timesheet-bar-chart.component.css']
})
export class TimesheetBarChartComponent implements OnInit {

  viewModel: any;
  isLoading: boolean;
  timeSheetReport: Array<TimeSheetReport>;
  timesheetFields: Array<LookupValue>;
  eventTypes: any[];
  series: any[];
  constructor(public timeService: TimesheetService, public commonService: CommonService) {

  }

  ngOnInit() {
    this.timesheetFields = EnumCoding.TimesheetChartFields;
    this.eventTypes = EnumCoding.EventTypes;
    this.viewModel = {};
    this.viewModel.isProjectActivities = true;
    this.viewModel.eventTypes = this.eventTypes.filter(x => x.id == 1 || x.id == 2);
    this.viewModel.endTask = new Date();
    this.viewModel.category = this.timesheetFields[0];
    this.viewModel.groupby = this.timesheetFields[1];
    //this.filter();
  }

  filter() {

    if (isNullOrUndefined(this.viewModel.startTask) || isNullOrUndefined(this.viewModel.endTask)) {
      alert("Please Select Start and End Duration");
      return;
    }

    var endDate = new Date(this.viewModel.endTask);
    var filterModel = {
      eventTypes: this.viewModel.eventTypes.map((item: any) => item.id),
      isProjectActivities: this.viewModel.isProjectActivities,
      startDate: new Date(this.viewModel.startTask),
      endDate: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59)
    };
    this.isLoading = true;
    this.timeService.GetTimeSheetChartReport(filterModel).subscribe((result: any) => {
      this.timeSheetReport = result.data;
      this.isLoading = false;
      if (!isNullOrUndefined(this.viewModel.groupby))
        this.series = groupBy(this.timeSheetReport, [{ field: this.viewModel.groupby.name }]);
      else
        this.series = groupBy(this.timeSheetReport, [{ field: this.viewModel.category.name }]);
    }, error => {
      this.isLoading = false;
    });
  }

  fieldSelectionChange(value: LookupValue) {
    if (!isNullOrUndefined(value))
      this.series = groupBy(this.timeSheetReport, [{ field: value.name }]);
    else
      this.series = groupBy(this.timeSheetReport, [{ field: this.viewModel.category.name }]);
  }


  /* categories: any[];
    seriesData: any[];
    seriesss: any[];
    groupData: any;
    Sampel() {
      var endDate = new Date(this.viewModel.endTask);
      var filterModel = {
        eventTypes: [],
        projectId: !isNullOrUndefined(this.viewModel.project) ? this.viewModel.project.id : null,
        userId: !isNullOrUndefined(this.viewModel.user) ? this.viewModel.user.id : 0,
        startDate: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 15, 0, 0, 0),
        endDate: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59)
      };
      this.isLoading = true;
      this.timeService.GetTimeSheetReport(filterModel).subscribe((result: any) => {
        debugger;
        this.timeSheetReport = result.data;
        this.isLoading = false;
        this.categories = [];
        this.seriesss = groupBy(this.timeSheetReport, [{ field: "organizationRole" }]);
        this.groupData = groupBy(this.timeSheetReport, [{ field: "project" }]); // _.groupBy(this.timeSheetReport, x => x.project);
        var discGrp = [];
        _.forEach(groupBy(this.timeSheetReport, [{ field: "organizationRole" }]), (g: any) => {
          discGrp.push(g.value);
        });
        this.seriesData = [];
        _.forEach(this.groupData, g => {
          var series = [];
          this.categories.push(g.value);
          var disc = groupBy(g.items, [{ field: "organizationRole" }]);
          for (let i = 0; i < discGrp.length; i++) {
            var fil =  _.filter(disc, (x: any) => x.value == discGrp[i]);
            if (fil.length > 0)
            {
              var sum =  _.sumBy(fil[0].items, "durationNumber");
              series.push(sum);
            }
            else 
            series.push(0);
          }
          this.seriesData.push({items:series, value: g.value});
        });
      }, error => {
        this.isLoading = false;
      });
    } */


}
