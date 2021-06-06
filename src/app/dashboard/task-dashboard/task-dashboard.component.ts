import { Component, OnInit, Input } from '@angular/core';
import { Project } from 'src/app/models/project';
import { isNullOrUndefined } from 'util';
import { Position } from 'src/app/modules/general/enums/position.enum';
import * as _ from 'lodash';

@Component({
  selector: 'app-task-dashboard',
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['./task-dashboard.component.css']
})
export class TaskDashboardComponent implements OnInit {
  
  hasIdc : boolean;
  ptCount: number;
  idcCount: number;
  @Input() public project: Project;

  constructor() { }

 
  ngOnInit() {
   this.init();
  }

  ngOnChanges() {
    this.init();
 }

  init()
  {
    if (!isNullOrUndefined(this.project))
    {
       this.hasIdc = _.some(this.project.roles, (role : any) => {
             return  role.positionId == Position.PSL
        });
    }
  }
  onPlannedTaskChanged(count : number)
  {
     this.ptCount = count;
  }
  onIdcChanged(count : number)
  {
     this.idcCount = count;
  }
}
