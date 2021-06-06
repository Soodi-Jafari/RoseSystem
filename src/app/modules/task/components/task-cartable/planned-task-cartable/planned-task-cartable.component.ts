import { Component, OnInit, ViewChild, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { GridDataResult, GridComponent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor, State, process } from '@progress/kendo-data-query';
import { Router, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import * as _ from 'lodash';
import { Project } from 'src/app/models/project';
import { PlannedTask } from '../../../models/planned-task';
import { PlannedTaskService } from '../../../services/planned-task.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { EditPlanTaskComponent } from '../../planned-tasks/edit-plan-task/edit-plan-task.component';
import { Position } from 'src/app/modules/general/enums/position.enum';

@Component({
  selector: 'app-planned-task-cartable',
  templateUrl: './planned-task-cartable.component.html',
  styleUrls: ['./planned-task-cartable.component.css']
})
export class PlannedTaskCartableComponent implements OnInit {

  @Input() public project: Project;
  @Output() palnnedTaskChanged = new EventEmitter<number>();

  isLoading : boolean;
  gridView: GridDataResult;
  @ViewChild("grid") private grid: GridComponent;
  hasProgresssAccess: boolean;
  public aggregates: any[] = [{field: 'currentState', aggregate: 'count'},{field: 'disciplineName', aggregate: 'count'}];
  groups: GroupDescriptor[] = [{
    field: 'currentState',
    aggregates: this.aggregates
  },
  {
    field: 'disciplineName',
    aggregates: this.aggregates
  }];
  plannedTasks: PlannedTask[] 
  priorities : Array<any>;
  
  state: State = {
   group: this.groups
};
  constructor(public taskService : PlannedTaskService,private router: Router,private dialog: MatDialog) {
    this.plannedTasks = [];
    this.priorities = EnumCoding.Priorities;
   }

  ngOnInit() {
   this.hasProgresssAccess =  _.some(this.project.roles, (role : any) => {
      return  role.positionId == Position.PSL || role.positionId == Position.Expert
    });
  }

  
  ngOnChanges(changes: SimpleChanges) {
    this.getPlannedTasks();
   }
 
  getPlannedTasks() : void {    

        this.isLoading = true;
        this.taskService.getListByPost('PlannedTaskCartable',this.project)
        .subscribe( (result : any) =>  {
           this.isLoading = false;
           _.forEach(result.data,(m : any) => {
            m.creationDate = new Date(m.creationDate);
            m.dueDate = new Date(m.dueDate);
           }); 
           this.plannedTasks = result.data;
           this.setGrid();
           this.CollapseOfferGridData(); 
           this.palnnedTaskChanged.emit(this.plannedTasks.length);
         }, error => {    
          this.isLoading = false;
        });   
  }
  
  private setGrid(): void {      
    this.gridView = process(this.plannedTasks,this.state);   
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    if (state && state.group) {
      state.group.map(group => group.aggregates = this.aggregates);
    }
    this.state = state;
    this.setGrid();
  }

  public editRow(row: any)
   {
      this.router.navigate([`/home/task/plannedTaskApproval/${row.id}`]);       
    } 

    getStateTitle(id)
    {
      if (!isNullOrUndefined(id))
        return EnumCoding.PlannedTaskStates.find((t : any) => t.id == id).title;
    }

    CollapseOfferGridData()
    {
     /*  var grp = _.groupBy(this.plannedTasks,(item: any) => item.currentState);
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
      }); */
    }

    public priority(id: number): any {
      return this.priorities.find((x: any) => x.id === id);
  }

editTask(row: any)
{                 
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = false;
  dialogConfig.width = "650px";
  dialogConfig.height = "350px";
  dialogConfig.data = row;

  const dialogRef = this.dialog.open(EditPlanTaskComponent, dialogConfig);
  dialogRef.afterClosed().subscribe(result => {
   if (result != null)
     this.getPlannedTasks();
  });  
}

}

