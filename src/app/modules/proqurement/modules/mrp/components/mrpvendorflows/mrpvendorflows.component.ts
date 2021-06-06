import { Component, OnInit } from '@angular/core';
import { GridDataResult,  DataStateChangeEvent, RowClassArgs, SelectionEvent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { MrpvendorBidding } from '../../models/mrpvendor-bidding';
import { MrpVendorFlow } from '../../models/mrp-vendor-flow';
import { MRPVendorFlowService } from '../../services/mrp-vendor-flow.service';
import { MRPService } from '../../services/mrp.service';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';


@Component({
  selector: 'app-mrpvendorflows',
  templateUrl: './mrpvendorflows.component.html',
  styleUrls: ['./mrpvendorflows.component.css']
})
export class MrpvendorflowsComponent implements OnInit {
  
   isLoading : boolean;
   gridView: GridDataResult;
   gridViewVendor: GridDataResult;
   selectionRows: any[] = [];
   vendorSelectionRows: any[] = [];
   vendorFlows: MrpVendorFlow[] 
   vendors: MrpvendorBidding[]
   currentVendor : any;
   mrp: any;
   mrpId: string;

   state: State = {
    skip: 0,
    take: 5
      
};

stateVendor: State = {
  skip: 0,
  take: 5
    
};

  constructor(public vendorFlowService : MRPVendorFlowService,
                public mrpService : MRPService,private router: Router,
                  private route: ActivatedRoute) {
                    this.isLoading = true;
         this.mrpId = this.route.snapshot.paramMap.get('mrpId');
         this.vendorFlows = [];
         this.vendors = [];
   }
  
 ngOnInit() {
    
  this.getMrp();
  this.getVendors();
}

getVendors()
{
  this.vendorFlowService.getListLookup('GetMRPVendors', this.mrpId).subscribe((data : any) => 
  {
      this.isLoading = false;
      this.vendors =  data.data;
      this.setVendorGrid();
  });
}

getMrp()
{
  this.mrpService.GetMrp(this.mrpId).subscribe((result : any) => 
  {
      this.mrp = result.model;
  });
}

public selectionChange(value: any): void {

  if (value.selectedRows.length > 0)
  {
     this.currentVendor = value.selectedRows[0].dataItem;
     this.getMRPVendorFlows();
  }
  {
    this.vendorFlows = [];
    this.setGrid();
  }
}

private setGrid(): void {      
  this.gridView = process(this.vendorFlows,this.state);
}

private setVendorGrid(): void {      
  this.gridViewVendor = process(this.vendors,this.stateVendor);
}

getMRPVendorFlows() : void {
  this.isLoading = true;
  this.vendorFlowService.getList('GetMRTVendorFlow', this.currentVendor.Id)
  .subscribe( (result : any) =>  {
    this.isLoading = false;
    this.vendorFlows = result.data;
    this.setGrid(); 
    this.setExcellData();
  }, error => {    
    this.isLoading = false;
  });  
}

setExcellData()
{
   var flows = this.vendorFlows.map((item : any) => {
    return { 
      vendor : item.vendor,
      letterNo : item.letterNo,
      letterDate : item.letterDate,
      subject : item.subject,
      correspondenceType : this.getCorespondenceTitle(item.correspondenceType),
      direction : item.direction ? "Vendor --> Commany" : "Company --> Vendor"
     
    };

  });

  this.data = process(flows, {
    group: this.group
  }).data;  
}

public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.setGrid();
}

public dataVendorStateChange(state: DataStateChangeEvent): void {
  this.stateVendor = state;
  this.setVendorGrid();
}

   public new()
   {
     if (!isNullOrUndefined(this.currentVendor))
         this.openDetail(null);
     else
     {
          alert("Please, select Vendor!")
      }
   }
 // export to excel
 public group: any[] = [{
  field: 'vendor.title'
}];

public data: any[] ;
   
public edit()
{
    if (this.selectionRows.length > 0)
    {
    var item = this.vendorFlows.find((row: any) => { return row.id ==  this.selectionRows[0];})
    this.openDetail(item);
    }
}

public editRow(row: any)
{
    this.openDetail(row);

}
   public openDetail(row : any)
   {
      var rowId = null;
      if (!isNullOrUndefined(row))
          rowId = row.id;
      this.router.navigate([`/home/procurement/preOrder/vendorflow/detail/${this.mrpId}/${this.currentVendor.Id}/${this.currentVendor.Vendor}/${rowId}/null`]);
        
    } 
    
    public rowCallback = (context: RowClassArgs) => {
      switch (context.dataItem.IsQualified) {
        case true:
          return {green : true};
        case false:
          return {red : true};
        default:
          return {};
       }
     }
     
    getCorespondenceTitle(id)
    {
      if (!isNullOrUndefined(id))
        return EnumCoding.correspondenceTypes.find((t : any) => t.id == id).title;
    }

    getStateTitle(id)
    {
      if (!isNullOrUndefined(id))
      {
        if (id > 0)
           return EnumCoding.vendorFlowStates.find((t : any) => t.id == id).title;
        else
          return "Procurement Cord. Submit"
      }
    }

    delete()
    {
      if (this.selectionRows.length > 0)
      { 
        var item = this.vendorFlows.find((row: any) => { return row.id ==  this.selectionRows[0];})
       if(confirm(`Are you sure to delete  "${item.subject}"`)) {
         this.isLoading = true;
          this.vendorFlowService.Delete(item).subscribe( result => {
             this.getMRPVendorFlows();
           }, error => {
      
             this.isLoading = false;;
             alert(`Item "${item.subject}" is used. Could not be deleted.`);
         });
       }
 
      }
    }
  
   
}




