import { Component, OnInit } from '@angular/core';
import { Subject } from 'src/app/home/observer/subject';
import { Observer } from 'src/app/home/observer/observer';
import { isNullOrUndefined } from 'util';
import { Position } from 'src/app/modules/general/enums/position.enum';
import * as _ from 'lodash';

@Component({
  selector: 'app-task-cartable',
  templateUrl: './task-cartable.component.html',
  styleUrls: ['./task-cartable.component.css']
})
export class TaskCartableComponent implements OnInit,Observer {

  hasIdc : boolean;
  ptCount: number;
  idcCount: number;
constructor(public subject: Subject) {
      
      this.subject.attach(this);
}

  ngOnInit() {
    this.init();
  }

  refresh(): void {  
   this.init();
  }

  init()
  {
    if (!isNullOrUndefined(this.subject.getState()))
    {
       this.hasIdc = _.some(this.subject.getState().roles, (role : any) => {
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



