import { Component, OnInit, ViewChild, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { GridDataResult, GridComponent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor, State, process } from '@progress/kendo-data-query';
import { MrpVendorFlow } from '../../../modules/mrp/models/mrp-vendor-flow';
import { MRPVendorFlowService } from '../../../modules/mrp/services/mrp-vendor-flow.service';
import { Router, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import * as _ from 'lodash';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'app-vor-cartable',
  templateUrl: './vor-cartable.component.html',
  styleUrls: ['./vor-cartable.component.css']
})
export class VorCartableComponent implements OnInit {

  @Input() public project: Project;
  @Output() vorChanged = new EventEmitter<number>();

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
  vendorFlows: MrpVendorFlow[] 

  state: State = {
   group: this.groups
};
  constructor(public vendorFlowService : MRPVendorFlowService,private router: Router) {
    this.vendorFlows = [];
   }

  ngOnInit() {
  }

  
  ngOnChanges(changes: SimpleChanges) {
    this.getMRPVendorFlows();
   }
 
  getMRPVendorFlows() : void {    

        this.isLoading = true;
        this.vendorFlowService.getListByPost('MRPVendorFlowCartable',this.project)
        .subscribe( (result : any) =>  {
           this.isLoading = false;
           _.forEach(result.data,(m : any) => {
            m.creationDate = new Date(m.creationDate);
            m.deadline = new Date(m.deadline);
           }); 
           this.vendorFlows = result.data;
           this.setGrid();
           this.CollapseOfferGridData(); 
           this.vorChanged.emit(this.vendorFlows.length);
         }, error => {    
          this.isLoading = false;
      });        
  }
  
  private setGrid(): void {      
    this.gridView = process(this.vendorFlows,this.state);   
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
      var rowId =  row.id;
      this.router.navigate([`/home/procurement/preOrder/vendorflow/detail/${row.mrpId}/${row.vendor.id}/${row.vendor.title}/${rowId}/null`]);       
    } 

    getCorespondenceTitle(id)
    {
      if (!isNullOrUndefined(id))
        return EnumCoding.correspondenceTypes.find((t : any) => t.id == id).title;
    }

    getStateTitle(id)
    {
      if (!isNullOrUndefined(id))
        return EnumCoding.vendorFlowStates.find((t : any) => t.id == id).title;
    }


    CollapseOfferGridData()
    {
      var grp = _.groupBy(this.vendorFlows,(item: any) => item.currentState);
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
