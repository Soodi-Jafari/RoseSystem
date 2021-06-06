import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import {GridDataResult } from '@progress/kendo-angular-grid';
import { State,process, SortDescriptor } from '@progress/kendo-data-query';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';
import { PlannedTask } from 'src/app/modules/task/models/planned-task';
import { PlannedTaskService } from 'src/app/modules/task/services/planned-task.service';
import { Project } from 'src/app/models/project';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CreateCommentTaskComponent } from '../create-comment-task/create-comment-task.component';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { AddNextRevComponent } from '../add-next-rev/add-next-rev.component';
import { ApprovalFlow } from 'src/app/models/approval-flow';
import { PlannedTaskState } from 'src/app/modules/general/enums/planned-task-state.enum';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { ChangeTaskDocumentsTitleComponent } from '../change-task-documents-title/change-task-documents-title.component';


@Component({
  selector: 'app-create-next-rev-task',
  templateUrl: './create-next-rev-task.component.html',
  styleUrls: ['./create-next-rev-task.component.css']
})
export class CreateNextRevTaskComponent implements OnInit {

  @Input() public project: Project;
  
  isLoading: any
  //documentNo : string;
  tasks : PlannedTask[];
  public selectionRows: any[] = [];
  public gridView: GridDataResult;  
  public sort: SortDescriptor[] = [{
    field: 'id',
    dir: 'desc'
  }];
  public gridState: State = {
      sort: this.sort,
      skip: 0,
      take: 10
  };
  
  constructor(public taskService : PlannedTaskService,private dialog: MatDialog) {
            
   }

  ngOnInit() {
    this.getTaskDocuments()
  }
  
  ngOnChanges(changes: SimpleChanges) {
    this.getTaskDocuments()
   }
   
  clearNewTaskGrid()
  {
    this.tasks = [];
    this.setGridData();
  }

  getTaskDocuments()
  {
    this.selectionRows = [];
    if (!isNullOrUndefined(this.project))
    {
      this.isLoading = true;   
      var filter = {
      //  documentNo : !isNullOrEmptyString(this.documentNo) ? this.documentNo.trim() : this.documentNo,
        projId : this.project.id
      }
      this.taskService.getListByPost("PlannedTasks",filter).subscribe((result : any) =>     {
          this.isLoading = false;   
          this.tasks = result.data;
          this.setGridData();            
       }, error => {    
        this.isLoading = false;
      });  
    }
    else
    {
        this.clearNewTaskGrid();
    }
  }

public onStateChange(state: State) {
  this.gridState = state;
  this.setGridData();
}

setGridData()
{
  this.gridView = process(this.tasks,this.gridState);
}

filterTasks()
{
  this.getTaskDocuments();
}

public addComment()
{
    if (this.selectionRows.length > 0)
    {
      var item = this.tasks.find((row: any) => { return row.id ==  this.selectionRows[0];})
      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.width = "750px";
      dialogConfig.height = "700px";
      dialogConfig.data = { task : item, mode : "comment"};

      const dialogRef = this.dialog.open(CreateCommentTaskComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result != null)
         this.getTaskDocuments();
      });
    }
    else
    {
      alert("Please select Task!");
    }
}

public addVersion()
{
    if (this.selectionRows.length > 0)
    {
      var item = this.tasks.find((row: any) => { return row.id ==  this.selectionRows[0];})
      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.width = "750px";
      dialogConfig.height = "460px";
      dialogConfig.data = item;

      const dialogRef = this.dialog.open(AddNextRevComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
       // if (result != null)
         // this.getTaskDocuments();
      });
    }
    else
    {
       alert("Please select Task!");
    }
}

getStateTitle(id)
{
  if (!isNullOrUndefined(id))
    return EnumCoding.PlannedTaskStates.find((t : any) => t.id == id).title;
}

cancelTask()
{
    if (this.selectionRows.length > 0)
    {      
      var item = this.tasks.find((row: any) => { return row.id ==  this.selectionRows[0];})
      if(confirm(`Are you sure to Cancel Task Rev  "${item.revision}"`)) {
          var state = new ApprovalFlow();
          state.entityId = item.id;
          state.flowState = PlannedTaskState.Canceled;
          state.comment = "We recieved comment from client..."
          this.isLoading = true;
          this.taskService.ChangeState(state).subscribe( result => {
            this.getTaskDocuments();
       
          }, error => {     
            this.isLoading = false;
            var errMessage ='';
            if (error.error.length > 0)
              error.error.forEach((err: string) => errMessage = errMessage +  err + '\n');           
            else
              errMessage = error.error.ExceptionMessage;

            alert(errMessage);
           });
       }
    }
    else
    {
      alert("Please select Task!");
    }
}

}

