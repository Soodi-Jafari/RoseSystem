import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PlannedTask } from '../../../models/planned-task';
import { EditService } from 'src/app/services/edit.service';
import { PlannedTaskService } from '../../../services/planned-task.service';
import { Subject } from 'src/app/home/observer/subject';
import { Observer } from 'src/app/home/observer/observer';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import * as _ from 'lodash';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CreateCommentTaskComponent } from './create-comment-task/create-comment-task.component';

@Component({
  selector: 'create-planned-task',
  templateUrl: './create-planned-task.component.html',
  styleUrls: ['./create-planned-task.component.css']
})
export class CreatePlannedTaskComponent implements OnInit, Observer {

  @ViewChild("grid") private grid: GridComponent;

  isLoading: any
  dueDate: Date;
  startDate: Date;
  priorities: Array<any>;
  tasks: PlannedTask[];
  public selectionRows: any[] = [];
  public gridView: GridDataResult;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 20
  };

  public formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, public editService: EditService, public subject: Subject,
    public taskService: PlannedTaskService, private dialog: MatDialog) {
    this.dueDate = null;
    this.startDate = null;
    this.tasks = [];
    this.priorities = EnumCoding.Priorities;
    this.subject = subject;
    this.subject.attach(this);
  }

  ngOnInit() {
  }

  refresh(): void {
    if (isNullOrUndefined(this.dueDate) || isNullOrUndefined(this.startDate))
      this.clearNewTaskGrid();
    else
      this.getTaskDocuments();
  }

  getTaskDocuments() {
    if (!isNullOrUndefined(this.subject.getState())) {
      this.isLoading = true;
      var filter = {
        dueDate: this.dueDate,
        startDate: this.startDate,
        projectId: this.subject.getState().pmProjectId,
        projId: this.subject.getState().id
      }
      this.taskService.GetDocuments("TaskDocuments", filter).subscribe((result: any) => {
        this.isLoading = false;
        _.forEach(result.data, (m: any) => {
          m.startDate = new Date(m.startDate);
          m.dueDate = new Date(m.dueDate);
        });
        this.tasks = result.data;
        this.setGridData();
      });
    }
    else {
      this.clearNewTaskGrid();
    }
  }

  clearNewTaskGrid() {
    this.tasks = [];
    this.setGridData();
  }

  public priority(id: number): any {
    return this.priorities.find((x: any) => x.id === id);
  }

  public onStateChange(state: State) {
    this.gridState = state;
    this.setGridData();
  }

  setGridData() {
    this.gridView = process(this.tasks, this.gridState);
  }

  public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }) {

    if (!isEdited) {
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    }
  }

  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;
    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      this.editService.assignValues(dataItem, formGroup.value);
      this.editService.update(dataItem);
    }
  }

  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      'revision': dataItem.revision,
      'priority': dataItem.priority
    });
  }

  filterDocuments() {
    this.getTaskDocuments();
  }

  crteateTasks() {
    this.grid.closeCell();
    if (this.selectionRows.length == 0) {
      alert("Please select document!");
      return;
    }

    var list = []
    for (let index = 0; index < this.selectionRows.length; index++) {
      var item = this.tasks.find((row: any) => { return row.id == this.selectionRows[index]; })
      item.id = 0;
      list.push(item);
    }

    this.isLoading = true;
    this.taskService.batchSaveTask(list).subscribe((result: any) => {
      this.isLoading = false;
      this.getTaskDocuments();
      this.selectionRows = [];
    }, error => {
      this.isLoading = false;
    });
  }

  public addFileAndSave() {
    if (this.selectionRows.length == 1) {
      var item = this.tasks.find((row: any) => { return row.id == this.selectionRows[0]; })
      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.width = "750px";
      dialogConfig.height = "700px";
      dialogConfig.data = { task: item, mode: "attachFile" };

      const dialogRef = this.dialog.open(CreateCommentTaskComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result != null)
          this.getTaskDocuments();
      });
    }
    else {
      alert("Please select One Document!");
    }
  }

}
