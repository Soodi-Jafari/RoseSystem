import { Component, OnInit, ViewChild } from '@angular/core';
import { GridDataResult, DataStateChangeEvent, GridComponent } from '@progress/kendo-angular-grid';
import { MrpVendorFlow } from '../../models/mrp-vendor-flow';
import { State, GroupDescriptor,process } from '@progress/kendo-data-query';
import { MRPVendorFlowService } from '../../services/mrp-vendor-flow.service';
import { Router } from '@angular/router';
import { Subject } from 'src/app/home/observer/subject';
import { Observer } from 'src/app/home/observer/observer';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import * as _ from 'lodash';

@Component({
  selector: 'app-vendor-offers',
  templateUrl: './vendor-offers.component.html',
  styleUrls: ['./vendor-offers.component.css']
})
export class VendorOffersComponent implements OnInit,Observer {

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
  vendorFlows: MrpVendorFlow[];

  state: State = {
   group: this.groups
};

constructor(public vendorFlowService : MRPVendorFlowService,
            public subject: Subject,private router: Router) {
      this.vendorFlows = [];
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
     this.getMRPVendorFlows();
  }

  getMRPVendorFlows() : void {    
    if (!isNullOrUndefined(this.subject.getState()))
     {  
        this.isLoading = true;
        this.vendorFlowService.getListByPost('VendorOffers',this.subject.getState())
        .subscribe( (result : any) =>  {
           this.isLoading = false;
           _.forEach(result.data,(m : MrpVendorFlow) => {
            m.creationDate = new Date(m.creationDate);
           }); 
           this.vendorFlows = result.data;
           this.setGrid(); 
           this.CollapseGridData();
         });
      }       
  }

  private setGrid(): void {      
    this.gridView = process(this.vendorFlows,this.state);    
  }

  CollapseGridData()
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

  public dataStateChange(state: DataStateChangeEvent): void {
    if (state && state.group) {
      state.group.map(group => group.aggregates = this.aggregates);
    }
    this.state = state;
    this.setGrid();
  }

  public viewVendorOffer(row: any)
  {
      this.router.navigate([`/home/procurement/preOrder/vendorflow/detail/${row.mrpId}/${row.vendor.id}/${row.vendor.title}/${row.id}/null`]);       
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

}
