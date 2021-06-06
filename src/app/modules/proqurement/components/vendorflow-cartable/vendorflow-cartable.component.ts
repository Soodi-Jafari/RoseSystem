import { Component, OnInit } from '@angular/core';
import { Subject } from 'src/app/home/observer/subject';
import { Observer } from 'src/app/home/observer/observer';
import { isNullOrUndefined } from 'util';
import { Position } from 'src/app/modules/general/enums/position.enum';
import * as _ from 'lodash';

@Component({
  selector: 'app-vendorflow-cartable',
  templateUrl: './vendorflow-cartable.component.html',
  styleUrls: ['./vendorflow-cartable.component.css']
})
export class VendorflowCartableComponent implements OnInit,Observer {

  hasIdc : boolean;
  vorCount: number;
  vdrCount: number;
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

  onVorChanged(vorCount : number)
  {
     this.vorCount = vorCount;
  }
  onVdrChanged(vorCount : number)
  {
     this.vdrCount = vorCount;
  }
  onIdcChanged(vorCount : number)
  {
     this.idcCount = vorCount;
  }
  
}


