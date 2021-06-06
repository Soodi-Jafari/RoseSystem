import { Component, OnInit, ViewChild } from '@angular/core';
import { GridDataResult, GridComponent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, process, groupBy } from '@progress/kendo-data-query';
import { TimesheetService } from '../../../services/timesheet.service';
import { isNullOrUndefined } from 'util';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DisciplineResourcesComponent } from '../discipline-resources/discipline-resources.component';
import * as _ from 'lodash';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { DisciplineResourcesService } from '../../../services/discipline-resources.service';
import { DisciplineResource } from '../../../models/discipline-resource';

interface ColumnSetting {
  field: string;
  title: string;
  format?: string;
  type: 'text' | 'numeric' | 'boolean' | 'date';
}
@Component({
  selector: 'app-discipline-plan-resource-report',
  templateUrl: './discipline-plan-resource-report.component.html',
  styleUrls: ['./discipline-plan-resource-report.component.css']
})

export class DisciplinePlanResourceReportComponent implements OnInit {

  isLoading: boolean;
  viewModel;
  gridView: GridDataResult;
  public columns: any[]
  disciplines: Array<DisciplineResource>
  @ViewChild("grid") private grid: GridComponent;
  plannedTimes: any[]
  state: State = {
  };

  constructor(private timeService: TimesheetService, private dialog: MatDialog, public discService: DisciplineResourcesService) { }

  ngOnInit() {
    this.viewModel = {}
    this.getResource();   
  }

  filter() {

    /* if (isNullOrUndefined(this.viewModel.startDate) || isNullOrUndefined(this.viewModel.endDate)) {
      alert("Please enter required fields!");
      return;
    }
    if (this.viewModel.startDate > this.viewModel.endDate) {
      alert("تاریخ شروع نمیتواند از تاریخ پایان بزرگتر باشد!");
      return;
    } */
    this.creatGridColumn();
    var end = new Date(this.viewModel.endDate);
    var filterModel = {
      startDate: new Date(this.viewModel.startDate),
      endDate: new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59)
    };
    this.isLoading = true;
    this.timeService.GetDisiplinePlanResourcesReport().subscribe((result: any) => {
      this.isLoading = false;
      this.createGridDate(result.data);
    }, error => {
      this.isLoading = false;
    });
  }

  private setGrid(): void {
    this.gridView = process(this.plannedTimes, this.state);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.setGrid();
  }

  creatGridColumn() {
    var start1 = new Date().getMonth() + 1;
    var end1 =  start1 == 1 ? 12 : start1 -1; 
    var start2;
    var end2;
    this.columns = [];
    if (start1 > end1) {
      end2 = end1;
      end1 = 12;
      start2 = 1;
    }
    for (var idx = start1; idx <= end1; idx++) {
      var col = {
        title: EnumCoding.MiladiMonth.find((t: any) => t.id == idx).title,
        field: 'month' + idx,
        index: idx
      }
      this.columns.push(col);
    }
    if (!isNullOrUndefined(start2))
      for (var ix = start2; ix <= end2; ix++) {
        var colm = {
          title: EnumCoding.MiladiMonth.find((t: any) => t.id == ix).title,
          field: 'month' + ix,
          index: ix
        }
        this.columns.push(colm);
      }
  }

  createGridDate(data: any[]) {
    this.plannedTimes = [];
    var grp = groupBy(data, [{ field: 'discipline' }]);
    _.forEach(grp, g => {
      var row: any = {};
      for (var i = 0; i < this.columns.length; i++) {
        var item = _.filter(g.items, x => x.month == this.columns[i].index);
        var plan = item.length > 0 ? item[0].planManHaur : 0
        this.columns[i].index == 1 ? row.month1 = plan : this.columns[i].index == 2 ? row.month2 = plan : this.columns[i].index == 3 ? row.month3 = plan : this.columns[i].index == 4 ? row.month4 = plan :
          this.columns[i].index == 5 ? row.month5 = plan : this.columns[i].index == 6 ? row.month6 = plan : this.columns[i].index == 7 ? row.month1 = plan : this.columns[i].index == 8 ? row.month8 = plan :
            this.columns[i].index == 9 ? row.month9 = plan : this.columns[i].index == 10 ? row.month10 = plan : this.columns[i].index == 11 ? row.month11 = plan : this.columns[i].index == 12 ? row.month12 = plan : null
      }
      row.discipline = g.value;
      var disc = _.filter(this.disciplines, x => x.disciplineTitle == row.discipline)
      row.availableResource = disc.length > 0 ? disc[0].availableResources : "";
      this.plannedTimes.push(row);
    });
    this.setGrid();
  }

  getResource() {
    this.isLoading = true;
    this.disciplines = [];
    this.discService.getList('DisciplineResource').subscribe((result: any) => {
      this.disciplines = result.data;
      this.filter();

    }, error => {
      this.isLoading = false;
    });
  }

  openDisiplines() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "700px";
    dialogConfig.height = "560px";
    const dialogRef = this.dialog.open(DisciplineResourcesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (!isNullOrUndefined(result))
        if (!isNullOrUndefined(this.viewModel.endDate) && !isNullOrUndefined(this.viewModel.endDate))
          this.filter();
    });
  }

}
