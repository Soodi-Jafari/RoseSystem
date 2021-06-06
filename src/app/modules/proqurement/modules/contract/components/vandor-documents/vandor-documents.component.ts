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

@Component({
  selector: 'app-vandor-documents',
  templateUrl: './vandor-documents.component.html',
  styleUrls: ['./vandor-documents.component.css']
})
export class VandorDocumentsComponent implements OnInit {

  isLoading : boolean;
  gridView: GridDataResult;
  @ViewChild("grid") private grid: GridComponent;
  public aggregates: any[] = [{field: 'currentState', aggregate: 'count'},{field: 'discipline', aggregate: 'count'}];
  groups: GroupDescriptor[] = [{
    field: 'currentState',
    aggregates: this.aggregates
  },
  {
    field: 'discipline',
    aggregates: this.aggregates
  }];
  vdrs: VDR[] 

  state: State = {
   group: this.groups
};

  constructor(public vdrService: VDRService, public subject: Subject,private router: Router,private route: ActivatedRoute) {
    this.vdrs = [];
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
    this.getVdrs();
  }
  
  getVdrs() : void {    
    if (!isNullOrUndefined(this.subject.getState()))
     {  
        this.isLoading = true;
        this.vdrService.getListByPost('VDRList',this.subject.getState())
        .subscribe( (result : any) =>  {
           this.isLoading = false;
           _.forEach(result.data,(m : VDR) => {
            m.creationDate = new Date(m.creationDate);
            m.deadline = !isNullOrUndefined(m.deadline) ? new Date(m.deadline) : undefined;
           }) 
           this.vdrs = result.data;
           this.setGrid(); 
           this.CollapseOfferGridData();
         }, error => {    
          this.isLoading = false;
        });   
      }       
  }

  private setGrid(): void {      
    this.gridView = process(this.vdrs,this.state);    
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    if (state && state.group) {
      state.group.map(group => group.aggregates = this.aggregates);
    }
    this.state = state;
    this.setGrid();
  }

  getStateTitle(id)
  {
    if (!isNullOrUndefined(id))
      return EnumCoding.vendorFlowStates.find((t : any) => t.id == id).title;
  }

 public viewVdr(row: VDR)
 {
    this.router.navigate([`/home/procurement/vdr/${row.id}`]);       
 } 

  CollapseOfferGridData()
  {
    var grp = _.groupBy(this.vdrs,(item: any) => item.currentState);
    var idx = 0;
    _.forEach(grp, g => {
      this.grid.collapseGroup(idx.toString());     
      var grp2 = _.groupBy(g,(item: any) => item.discipline);
      var idx2 = 0;
      _.forEach(grp2, g => {
        this.grid.collapseGroup(`${idx.toString()}_${idx2.toString()}`);
        idx2++;      
      });
      idx++;
    });
  }


}

