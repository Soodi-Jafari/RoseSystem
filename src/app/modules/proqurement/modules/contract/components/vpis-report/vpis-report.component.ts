import { Component, OnInit, ViewChild } from '@angular/core';
import { GridDataResult, GridComponent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor, State ,process} from '@progress/kendo-data-query';
import { isNullOrUndefined } from 'util';
import { Subject } from 'src/app/home/observer/subject';
import { Router, ActivatedRoute } from '@angular/router';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import * as _ from 'lodash';
import { VDR } from '../../models/vdr';
import { VDRService } from '../../services/vdr.service';
import { VPISService } from '../../services/vpis.service';
import { VpisReport } from '../../models/vpis-report';

@Component({
  selector: 'app-vpis-report',
  templateUrl: './vpis-report.component.html',
  styleUrls: ['./vpis-report.component.css']
})

export class VpisReportComponent implements OnInit {

  isLoading : boolean;
  gridView: GridDataResult;
 // @ViewChild("grid") private grid: GridComponent;
  public groups: GroupDescriptor[];
  vpis: VpisReport[] 

  public state: State = {
    skip: 0,
    take: 15,
    group: this.groups
      
};

  constructor(public vpisService: VPISService, public subject: Subject,private router: Router,private route: ActivatedRoute) {
    this.vpis = [];
    this.subject = subject;
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
    this.getReport();
  }

  
  getReport() : void {    
    if (!isNullOrUndefined(this.subject.getState()))
     {  
        this.isLoading = true;
        this.vpisService.getList('VPISReport', `${this.subject.getState().id}`)
        .subscribe( (result : any) =>  {
           this.isLoading = false;
           _.forEach(result.data,(m : any) => {
              m.lastTransmittalDate = new Date(m.lastTransmittalDate);
              m.lastCommentDate = new Date(m.lastCommentDate);
           }) 
           this.vpis = result.data;
           this.setGrid(); 
         }, error => {    
          this.isLoading = false;
        });  
      }       
  }

  private setGrid(): void {      
    this.gridView = process(this.vpis,this.state);    
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.setGrid();
  }

/* 
 public viewVdr(row: VDR)
 {
    this.router.navigate([`/home/vdr/${row.id}`]);       
  } 
 */

}


