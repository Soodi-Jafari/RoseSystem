import { Component, OnInit } from '@angular/core';
import {GridDataResult } from '@progress/kendo-angular-grid';
import { State,process } from '@progress/kendo-data-query';
import { PlannedTask } from '../../../models/planned-task';
import { PlannedTaskService } from '../../../services/planned-task.service';
import { Subject } from 'src/app/home/observer/subject';
import { Observer } from 'src/app/home/observer/observer';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import * as _ from 'lodash';
import { PlannedTaskState } from 'src/app/modules/general/enums/planned-task-state.enum';

@Component({
  selector: 'app-assign-plan-task',
  templateUrl: './assign-plan-task.component.html',
  styleUrls: ['./assign-plan-task.component.css']
})
export class AssignPlanTaskComponent implements OnInit,Observer {

  isLoading: any
  dueDate : Date;
  priorities : Array<any>;
  tasks : PlannedTask[];
  public selectionRows: any[] = [];
  public gridView: GridDataResult;  
  public gridState: State = {
      sort: [],
      skip: 0,
      take: 20
  };
  
  constructor(public subject: Subject,public taskService : PlannedTaskService) {
            this.dueDate = null;
            this.tasks = [];
            this.priorities = EnumCoding.Priorities;
            this.subject = subject;
            this.subject.attach(this);
   }

  ngOnInit() {
     this.getTaskDocuments();
  }

  refresh(): void {
      this.getTaskDocuments();
  }
  
  getTaskDocuments()
  {
    if (!isNullOrUndefined(this.subject.getState()))
    {
      this.isLoading = true;   
      var filter = {
        dueDate : this.dueDate,
        projId : this.subject.getState().id
      }
      this.taskService.GetDocuments("CreatedTasks",filter).subscribe((result : any) =>     {
          this.isLoading = false;   
          this.tasks = result.data;
          this.setGridData();            
       });
    }
    else
      this.setGridData();
  }

  public priority(id: number): any {
    return this.priorities.find((x: any) => x.id === id);
}

public onStateChange(state: State) {
  this.gridState = state;
  this.setGridData();
}

setGridData()
{
  this.gridView = process(this.tasks,this.gridState);
}

filterDocuments()
{
  this.getTaskDocuments();
}

assignTasks()
{  
  if (this.selectionRows.length == 0)
  {    
    alert("Please select Document!");
     return;
  }

  var list =  []
  for (let index = 0; index < this.selectionRows.length; index++) {
    var item = this.tasks.find((row: any) => { return row.id ==  this.selectionRows[index];}) 
    item.currentState = PlannedTaskState.WaitPSL;
    item.actualStart = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(), 0,0,0);
    list.push(item);
  }
  
  this.isLoading = true;
  this.taskService.batchSaveTask(list).subscribe((result : any) =>     {
    this.isLoading = false;   
    this.getTaskDocuments(); 
    this.selectionRows = []; 
 }, error => {    
  this.isLoading = false;
});  
}

}

