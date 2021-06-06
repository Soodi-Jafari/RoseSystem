import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig} from "@angular/material";
import { GridDataResult,  DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor,process, State } from '@progress/kendo-data-query';
import { VendorTransmittal } from '../../models/vendor-transmittal';
import { VendorTransmittalService } from '../../services/vendor-transmittal.service';
import { ActivatedRoute } from '@angular/router';
import { VendorTransmittalDetailComponent } from './vendor-transmittal-detail/vendor-transmittal-detail.component';
import { VendorTransmittalDocsComponent } from '../vendor-transmittal-docs/vendor-transmittal-docs.component';
import { Contract } from '../../models/contract';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { isNullOrUndefined } from 'util';
import { ContractService } from '../../services/contract.service';
import { VendorTransmitalDocDetailComponent } from '../vendor-transmittal-docs/vendor-transmital-doc-detail/vendor-transmital-doc-detail.component';


export interface TransmittalDialogData {
  transmittal: VendorTransmittal;
  contract: Contract;
} 

@Component({
  selector: 'app-vendor-transmittals',
  templateUrl: './vendor-transmittals.component.html',
  styleUrls: ['./vendor-transmittals.component.css']
})
export class VendorTransmittalsComponent implements OnInit {
 
  isLoading : boolean;
  public gridView: GridDataResult;
  public groups: GroupDescriptor[];
  public selectionRows: any[] = [];
  private contractId: Number;
  private transmittals: VendorTransmittal[] 
  public contract: Contract;
  public state: State = {
    skip: 0,
    take: 10,
    group: this.groups
      
};

  constructor(private dialog: MatDialog,private transmittalService : VendorTransmittalService,
               private contractService : ContractService   ,private route: ActivatedRoute )
   {
     this.transmittals = [];
     this.contractId = parseInt(this.route.snapshot.paramMap.get('contractId'))
    // this.subject = subject;
    // this.subject.attach(this);
  }

  public ngOnInit(): void {
    this.getContract();
    this.getTransmittals();
}

  private setGrid(): void {      
       this.gridView = process(this.transmittals,this.state);
  }
  
/*   refresh(): void {
  
    this.getTransmittals();
  }
 */
  getTransmittals(): void {
  
    /* if (isNullOrUndefined(this.subject.getState()))
    {
      this.transmittals = [];
      this.setGrid();
       return;
    } */

    this.isLoading = true;

    this.transmittalService.getList('GetAll',`${this.contractId}`)
    .subscribe( (result : any) =>  {
      this.isLoading = false;
        this.transmittals = result.data;
        this.setGrid();
    }, error => {    
      this.isLoading = false;
    });   
  }

  getContract()
  {
    this.isLoading = true;
    this.contractService.getSingle('GetSingle',`${this.contractId}`).subscribe((result: any) => 
     {
        this.isLoading = false;
        this.contract = result.model;  
     }, error => {    
      this.isLoading = false;
    });   
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.setGrid();
}

public new()
{
    this.openDetail(null);
}

public edit()
{
    if (this.selectionRows.length > 0)
    {
    var item = this.transmittals.find((row: any) => { return row.id ==  this.selectionRows[0];})
    this.openDetail(item);
    }
    else
    {
      alert("Please select a Transmittal!");
    }
}

delete()
{
  if (this.selectionRows.length > 0)
  { 
    var item = this.transmittals.find((row: any) => { return row.id ==  this.selectionRows[0];})
    if(confirm(`Are you sure to delete  "${item.transmittalNo}"`)) {
     this.isLoading = true;
      this.transmittalService.Delete(item).subscribe( result => {
         this.getTransmittals();
       }, error => {
  
         this.isLoading = false;;
         alert(`Item "${item.transmittalNo}" is used. Could not be deleted.`);
     });
   }

  }
}

public openDetail(row : any)
  {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "700px";
    dialogConfig.height = "480px";
    dialogConfig.data = {transmittal : row, contract : this.contract} ;
    
    const dialogRef = this.dialog.open(VendorTransmittalDetailComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
        if (result !== null)
         this.getTransmittals();

      });
   }

  openDocuments()
   {
    if (this.selectionRows.length > 0)
    {
       var item = this.transmittals.find((row: any) => { return row.id ==  this.selectionRows[0];})
    
       const dialogConfig = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus = false;
       dialogConfig.width = "900px";
       dialogConfig.height = "450px";
       dialogConfig.data = { transmittal :item };

      const dialogRef = this.dialog.open(VendorTransmittalDocsComponent, dialogConfig); 
     }
     else
     {
       alert("Please select Transmittal!");
     }
   }
   
   getTransmittalTypeTitle(id)
   {
     if (!isNullOrUndefined(id))
       return EnumCoding.VendorTransmittalTypes.find((t : any) => t.id == id).title;
   }
}



