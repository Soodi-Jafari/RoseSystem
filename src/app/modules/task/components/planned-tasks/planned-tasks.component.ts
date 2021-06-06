import { Component, OnInit, ViewChild } from '@angular/core';
import { GridDataResult, GridComponent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor, State, process } from '@progress/kendo-data-query';
import { Router, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import * as _ from 'lodash';
import { PlannedTask } from '../../models/planned-task';
import { PlannedTaskService } from '../../services/planned-task.service';
import { Subject } from 'src/app/home/observer/subject';
import { Observer } from 'src/app/home/observer/observer';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ChangeTaskDocumentsTitleComponent } from './create-planned-task/change-task-documents-title/change-task-documents-title.component';

@Component({
  selector: 'app-planned-tasks',
  templateUrl: './planned-tasks.component.html',
  styleUrls: ['./planned-tasks.component.css']
})
export class PlannedTasksComponent implements OnInit, Observer {

  isLoading: boolean;
  hiddenDiscColumn: boolean;
  hiddenStateColumn: boolean;
  gridView: GridDataResult;
  @ViewChild("grid") private grid: GridComponent;
  public aggregates: any[] = [{ field: 'currentState', aggregate: 'count' }, { field: 'disciplineName', aggregate: 'count' }];
  groups: GroupDescriptor[] = [{
    field: 'currentState',
    aggregates: this.aggregates
  },
  {
    field: 'disciplineName',
    aggregates: this.aggregates
  }];
  plannedTasks: PlannedTask[]
  public selectionRows: any[] = [];
  priorities: Array<any>;

  state: State = {
    group: this.groups
  };

  constructor(public taskService: PlannedTaskService, private router: Router, private route: ActivatedRoute,
    public subject: Subject, private dialog: MatDialog) {
    this.plannedTasks = [];
    this.priorities = EnumCoding.Priorities;
    this.subject = subject;
    this.subject.attach(this);
  }

  ngOnInit() {
    this.hiddenDiscColumn = true;
    this.hiddenStateColumn = true;
    this.getPlannedTasks();
  }

  refresh(): void {
    this.getPlannedTasks();
  }

  getPlannedTasks(): void {
    this.selectionRows = [];
    if (!isNullOrUndefined(this.subject.getState())) {
      this.isLoading = true;
      this.taskService.getListByPost('ProjectPlannedTasks', this.subject.getState())
        .subscribe((result: any) => {
          this.isLoading = false;
          _.forEach(result.data, (m: any) => {
            m.creationDate = new Date(m.creationDate);
            m.dueDate = new Date(m.dueDate);
          });
          this.plannedTasks = result.data;
          this.setGrid();
          this.CollapseOfferGridData();
        });
    }
    else {
      this.clearNewTaskGrid();
    }
  }

  clearNewTaskGrid() {
    this.plannedTasks = [];
    this.setGrid();
  }

  private setGrid(): void {
    this.gridView = process(this.plannedTasks, this.state);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    if (state && state.group) {
      state.group.map(group => group.aggregates = this.aggregates);
    }
    this.state = state;
    this.hiddenStateColumn = this.state.group.some(x => x.field == "currentState");
    this.hiddenDiscColumn = this.state.group.some(x => x.field == "disciplineName");
    this.setGrid();
  }

  public editRow(row: any) {
    this.router.navigate([`/home/task/plannedTaskApproval/${row.id}`]);
  }

  getStateTitle(id) {
    if (!isNullOrUndefined(id))
      return EnumCoding.PlannedTaskStates.find((t: any) => t.id == id).title;
  }

  CollapseOfferGridData() {
    var grp = _.groupBy(this.plannedTasks, (item: any) => item.currentState);
    var idx = 0;
    _.forEach(grp, g => {
      this.grid.collapseGroup(idx.toString());
      var grp2 = _.groupBy(g, (item: any) => item.disciplineName);
      var idx2 = 0;
      _.forEach(grp2, g => {
        this.grid.collapseGroup(`${idx.toString()}_${idx2.toString()}`);
        idx2++;
      });
      idx++;
    });
  }

  public priority(id: number): any {
    return this.priorities.find((x: any) => x.id === id);
  }

  delete() {
    if (this.selectionRows.length > 0) {
      var item = this.plannedTasks.find((row: any) => { return row.id == this.selectionRows[0]; })
      if (confirm(`Are you sure to delete  "${item.documentNo}"`)) {
        this.isLoading = true;
        this.taskService.Delete(item).subscribe(result => {
          this.getPlannedTasks();
        }, error => {

          this.isLoading = false;;
          alert(`Transmittal "${item.documentNo}" is used. Could not be deleted.`);
        });
      }
    }
  }

  public changeDocumentsTitle() {
    if (this.selectionRows.length > 0) {
      var item = this.plannedTasks.find((row: any) => { return row.id == this.selectionRows[0]; })
      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.width = "650px";
      dialogConfig.height = "450px";
      dialogConfig.data = item;

      const dialogRef = this.dialog.open(ChangeTaskDocumentsTitleComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result != null)
          this.getPlannedTasks();
      });
    }
    else {
      alert("Please Search Document No.!");
    }
  }
}

