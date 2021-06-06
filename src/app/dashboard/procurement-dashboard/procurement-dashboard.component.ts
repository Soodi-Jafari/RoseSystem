import { Component, OnInit, Input } from '@angular/core';
import { Project } from 'src/app/models/project';
import { isNullOrUndefined } from 'util';
import { Position } from 'src/app/modules/general/enums/position.enum';
import * as _ from 'lodash';

@Component({
  selector: 'app-procurement-dashboard',
  templateUrl: './procurement-dashboard.component.html',
  styleUrls: ['./procurement-dashboard.component.css']
})
export class ProcurementDashboardComponent implements OnInit {

  hasIdc : boolean;
  vorCount: number;
  vdrCount: number;
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
