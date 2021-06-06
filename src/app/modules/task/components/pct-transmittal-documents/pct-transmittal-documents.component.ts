import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GridDataResult, DataStateChangeEvent, RowClassArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { TransmittalService } from '../../services/transmittal.service';
import { from } from 'rxjs';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { GuidLookupValue } from 'src/app/models/lookup-value';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Component({
  selector: 'app-pct-transmittal-documents',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './pct-transmittal-documents.component.html',
  styleUrls: ['./pct-transmittal-documents.component.css']
})
export class PctTransmittalDocumentsComponent implements OnInit {

  isLoading: boolean;
  gridView: GridDataResult;
  transmittals: [];
  excellData: any[];
  state: State = {
  };
  viewModel: any;
  public pageSize = 100;
  public skip = 0;

  @ViewChild("projectList") projectList;
  public sourceProjects: Array<GuidLookupValue>
  public customers: Array<GuidLookupValue>
  public projects: Array<GuidLookupValue>

  constructor(public transmittalService: TransmittalService) {
    this.transmittals = [];
    this.allData = this.allData.bind(this);
  }

  ngOnInit() {
    this.customers = [];
    this.viewModel = {};
    this.getLookups();
  }

  ngAfterViewInit() {
    const projectContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    this.projectList.filterChange.asObservable().pipe(
      switchMap(value => from([this.sourceProjects]).pipe(
        tap(() => this.projectList.loading = true),
        delay(1000),
        map((items) => items.filter(projectContain(value)))
      ))
    )
      .subscribe(x => {
        this.projects = x;
      });

  }

  getLookups() {
    this.isLoading = true;
    this.transmittalService.getProjects().subscribe((data: any) => {
      this.isLoading = false;
      this.projects = this.sourceProjects = data.data;
    }, error => {
      this.isLoading = false;
    });
  }

  public projectSelectionChange(value: any): void {

    if (!isNullOrUndefined(value)) {
      this.getCustomers(value.id);
    }
    else {
      this.customers = [];
      this.viewModel.customer = undefined;
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.setGrid();
  }

  getCustomers(projectId) {
    this.transmittalService.getProjectCustomers(`${projectId}`).subscribe((data: any) => {
      this.isLoading = false;
      this.customers = data.data;
    }, error => {
      this.isLoading = false;
    });
  }

  getTransmittals(): void {

    this.isLoading = true;
    var filter = {
      projectId: this.viewModel.project.id,
      customerId: this.viewModel.customer.id,
      planDate: !isNullOrUndefined(this.viewModel.planDate) ? this.viewModel.planDate : null
    }
    this.transmittalService.getCalculatePCTDocuments(filter)
      .subscribe((result: any) => {
        this.isLoading = false;
        this.transmittals = result.data;
        this.setExcellData();
        this.setGrid();
      }, error => {
        this.isLoading = false;

      });
  }

  filter() {
    this.getTransmittals();
  }

  clearNewTaskGrid() {
    this.transmittals = [];
    this.setGrid();
  }

  private setGrid(): void {
    this.gridView = {
      data: this.transmittals.slice(this.skip, this.skip + this.pageSize),
      total: this.transmittals.length
    };
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.setGrid();
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: this.transmittals
    };

    return result;
  }

  roundPct(pct: number) {
    var rd = (_.round(pct, 4))
    var item = (_.round(rd * 100, 2));
    return item.toString() + " %"
  }

  roundWeight(weight: number) {
    var item = _.round(weight, 5);
    return item
  }

  setExcellData() {
    this.excellData = this.transmittals.map((item: any) => {
      return {
        level: item.level,
        wbsCode: item.wbsCode,
        docNo: item.docNo,
        docClass: item.docClass,
        docTitle: item.docTitle,
        discipline: item.discipline,
        firstIssueDate: !isNullOrUndefined(item.firstIssueDate) ? new Date(item.firstIssueDate) : null,
        secondIssueDate: !isNullOrUndefined(item.secondIssueDate) ? new Date(item.secondIssueDate) : null,
        thirdIssueDate: !isNullOrUndefined(item.thirdIssueDate) ? new Date(item.thirdIssueDate) : null,
        weight: this.roundWeight(item.weight),
        pct: this.roundPct(item.pct),
        planPct: this.roundPct(item.planPct),
        docStatusTitle: !isNullOrUndefined(item.lastTransmittal) ? item.lastTransmittal.docStatusTitle : null,
        revision: !isNullOrUndefined(item.lastTransmittal) ? item.lastTransmittal.revision : null,
        transmittalNo: !isNullOrUndefined(item.lastTransmittal) ? item.lastTransmittal.transmittalNo : null,
        transmittalDate: !isNullOrUndefined(item.lastTransmittal) ? new Date(item.lastTransmittal.transmittalDate) : null,
        commentRev: !isNullOrUndefined(item.lastComment) ? item.lastComment.revision : null,
        commentNo: !isNullOrUndefined(item.lastComment) ? item.lastComment.transmittalNo : null,
        commentDate: !isNullOrUndefined(item.lastComment) ? new Date(item.lastComment.transmittalDate) : null,
        commentStatus: !isNullOrUndefined(item.lastComment) ? item.lastComment.docStatusTitle : null,
      };
    });
  }

  public rowCallback = (context: RowClassArgs) => {

    switch (context.dataItem.level) {
      case 0:
        return { level0: true };
      case 1:
        return { level1: true };
      case 2:
        return { level2: true };
      case 3:
        return { level3: true };
      case 4:
        return { level4: true };
      case 5:
        return { level5: true };
      case 6:
        return { level6: true };
      case 7:
        return { level7: true };
      default:
        return {};
    }
  }

  public saveExcell(component): void {
    const options = component.workbookOptions();
    const rows = options.sheets[0].rows;

    rows.forEach((row) => {
      if (row.type === 'data') {
        var bcg = this.colorCode(row.cells[0].value);
        row.cells.forEach((cell) => {
          cell.background = bcg;
          cell.borderBottom = "1px solid darkgray";
          cell.borderRight = "1px solid darkgray";
          cell.italic = "true";
        });
      }
    });

    component.save(options);
  }

  colorCode(lev: number) {
    switch (lev) {
      case 0:
        return "#ffe6cc";
      case 1:
        return "#eeccff"
      case 2:
        return "#ccffb3"
      case 3:
        return "#00b300"
      case 4:
        return "#db70b8"
      case 5:
        return "#99ffff"
      case 6:
        return "#ccd9ff"
      case 7:
        return "#ffcce0"
      default:
        return ""
    }
  }


}

