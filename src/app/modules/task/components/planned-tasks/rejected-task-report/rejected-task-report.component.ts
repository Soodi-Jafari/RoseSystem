import { Component, OnInit, ViewChild } from '@angular/core';
import { GridDataResult, GridComponent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor, State, process } from '@progress/kendo-data-query';
import { Router, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import * as _ from 'lodash';
import { Subject } from 'src/app/home/observer/subject';
import { Observer } from 'src/app/home/observer/observer';
import { PlannedTaskApprovalReport } from '../../../models/planned-task-approval-report';
import { PlannedTaskService } from '../../../services/planned-task.service';

@Component({
  selector: 'app-rejected-task-report',
  templateUrl: './rejected-task-report.component.html',
  styleUrls: ['./rejected-task-report.component.css']
})
export class RejectedTaskReportComponent implements OnInit,Observer {

  isLoading : boolean;
  hiddenDiscColumn: boolean;
  hiddenStateColumn: boolean;
  gridView: GridDataResult;
  @ViewChild("grid") private grid: GridComponent;
  public aggregates: any[] = [{field: 'flowState', aggregate: 'count'},{field: 'disciplineName', aggregate: 'count'}];
  groups: GroupDescriptor[] = [{
    field: 'flowState',
    aggregates: this.aggregates
  },
  {
    field: 'disciplineName',
    aggregates: this.aggregates
  }];
  plannedTasks: PlannedTaskApprovalReport[] 
  public selectionRows: any[] = [];
  priorities : Array<any>;
  
  state: State = {
   group: this.groups
};

  constructor(public taskService : PlannedTaskService,private router: Router,private route: ActivatedRoute,
                   public subject: Subject) {
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

  getPlannedTasks() : void {    
    if (!isNullOrUndefined(this.subject.getState()))
    {
        this.isLoading = true;
        this.taskService.getListByPost('RejectedPlannedTasks',this.subject.getState())
        .subscribe( (result : any) =>  {
           this.isLoading = false;
           _.forEach(result.data,(m : any) => {
            m.creationDate = new Date(m.creationDate);
            m.dueDate = new Date(m.dueDate);
           }); 
           this.plannedTasks = result.data;
           this.setGrid();
           this.CollapseOfferGridData(); 
         }, error => {    
          this.isLoading = false;
        });   
      }
      else
      {
        this.clearNewTaskGrid();
      } 
  }
  
  clearNewTaskGrid()
  {
    this.plannedTasks = [];
    this.setGrid();
  }
  
  private setGrid(): void {      
    this.gridView = process(this.plannedTasks,this.state);   
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    if (state && state.group) {
      state.group.map(group => group.aggregates = this.aggregates);
    }
    this.state = state;
    this.hiddenStateColumn = this.state.group.some(x => x.field == "flowState");
    this.hiddenDiscColumn = this.state.group.some(x => x.field == "disciplineName");
    this.setGrid();
  }

  public editRow(row: any)
  {
      this.router.navigate([`/home/task/plannedTaskApproval/${row.taskId}`]);       
  } 

    getStateTitle(id)
    {
      if (!isNullOrUndefined(id))
        return EnumCoding.PlannedTaskStates.find((t : any) => t.id == id).title;
    }

    CollapseOfferGridData()
    {
      var grp = _.groupBy(this.plannedTasks,(item: any) => item.flowState);
      var idx = 0;
      _.forEach(grp, g => {
        this.grid.collapseGroup(idx.toString());     
        var grp2 = _.groupBy(g,(item: any) => item.disciplineName);
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

}

