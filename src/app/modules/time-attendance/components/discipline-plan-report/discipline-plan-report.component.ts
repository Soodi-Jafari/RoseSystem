import { Component, OnInit, ViewChild } from '@angular/core';
import { GridDataResult, GridComponent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor, State, process } from '@progress/kendo-data-query';
import { isNullOrUndefined } from 'util';
import { TimesheetService } from '../../services/timesheet.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-discipline-plan-report',
  templateUrl: './discipline-plan-report.component.html',
  styleUrls: ['./discipline-plan-report.component.css']
})
export class DisciplinePlanReportComponent implements OnInit {

  isLoading: boolean;
  viewModel;
  gridView: GridDataResult;
  @ViewChild("grid") private grid: GridComponent;
  // public aggregates: any[] = [{ field: 'currentState', aggregate: 'count' }, { field: 'disciplineName', aggregate: 'count' }];
  groups: GroupDescriptor[] = [{
    field: 'project',
    //  aggregates: this.aggregates
  },
  /* {
    field: 'disciplineName',
   // aggregates: this.aggregates
  } */];
  plannedTasks: any[]
  state: State = {
    group: this.groups
  };

  constructor(private timeService: TimesheetService) { }

  ngOnInit() {
    this.viewModel = {}
  }

  filter() {
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
      startDate: new Date(this.viewModel.startTask),
      endDate: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59)
    };
    this.isLoading = true;
    this.timeService.GetDisiplinePlanReport(filterModel).subscribe((result: any) => {
      this.plannedTasks = result.data;
      this.isLoading = false;
      this.setGrid();
      this.CollapseOfferGridData();
      // this.setExcellData();
    }, error => {
      this.isLoading = false;
    });
  }

  private setGrid(): void {
    this.gridView = process(this.plannedTasks, this.state);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    /*  if (state && state.group) {
       state.group.map(group => group.aggregates = this.aggregates);
     } */
    this.state = state;
    this.setGrid();
  }

  CollapseOfferGridData() {
    var grp = _.groupBy(this.plannedTasks, (item: any) => item.project);
    var idx = 0;
    _.forEach(grp, g => {
      this.grid.collapseGroup(idx.toString());
      idx++;
    });
  }

}
