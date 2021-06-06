import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig} from "@angular/material";
import { GridDataResult,  DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor,process, State } from '@progress/kendo-data-query';
import { Subject } from 'src/app/home/observer/subject';
import { isNullOrUndefined } from 'util';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
import { Contract } from '../../models/contract';
import { ContractService } from '../../services/contract.service';
import { ContractItemsComponent } from '../contract-items/contract-items.component';
import { ContractGuarantiesComponent } from '../contract-guaranties/contract-guaranties.component';
import { ContractTermPaymentsComponent } from '../contract-term-payments/contract-term-payments.component';
import { VPISListComponent } from '../contract-vpis/vpis-list.component';
import { Router } from '@angular/router';
import * as _ from 'lodash';

export interface ContractDialogData {
  contract: Contract;
} 

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {
 
  isLoading : boolean;
  public gridView: GridDataResult;
  public groups: GroupDescriptor[];
  public selectionRows: any[] = [];

  private contracts: Contract[] 
  public state: State = {
    skip: 0,
    take: 10,
    group: this.groups
      
};

  constructor(private dialog: MatDialog,private contractService : ContractService,
               public subject: Subject,private router: Router )
   {
     this.isLoading = true;
    this.contracts = [];
    this.subject = subject;
    this.subject.attach(this);
  }

  public ngOnInit(): void {
    this.getContracts();
}

  private setGrid(): void {      
       this.gridView = process(this.contracts,this.state);
  }
  
  refresh(): void {
  
    this.getContracts();
  }

  getContracts(): void {
  
    if (isNullOrUndefined(this.subject.getState()))
    {
      this.contracts = [];
      this.setGrid();
       return;
    }

    this.isLoading = true;
    var project = this.subject.getState(); 
    var urlParams = `${project.id}`;
   /*  // is PSL
    if (project.positionId == 7)
      urlParams = `${project.id.toString()}/${project.disciplinId}`
 */
    this.contractService.getList('GetAll',urlParams)
    .subscribe( (result : any) =>  {
      this.isLoading = false;
       _.forEach(result.data,(m : Contract) => {
        m.poDate = new Date(m.poDate);
       }) 
        this.contracts = result.data;
        this.setGrid();
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
    var item = this.contracts.find((row: any) => { return row.id ==  this.selectionRows[0];})
    this.openDetail(item);
    }
    else
    {
      alert("Please select Contract!");
    }
}

delete()
{
  if (this.selectionRows.length > 0)
  { 
    var item = this.contracts.find((row: any) => { return row.id ==  this.selectionRows[0];})
    if(confirm(`Are you sure to delete  "${item.poNo}"`)) {
     this.isLoading = true;
      this.contractService.Delete(item).subscribe( result => {
         this.getContracts();
       }, error => {
  
         this.isLoading = false;;
         alert(`Item "${item.poNo}" is used. Could not be deleted.`);
     });
   }

  }
}

public openDetail(row : any)
  {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "770px";
    dialogConfig.height = "640px";
    dialogConfig.data = row;
    
    const dialogRef = this.dialog.open(ContractDetailComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
        if (result !== null)
         this.getContracts();

      });
      
   }

  openItems()
   {
    if (this.selectionRows.length > 0)
    {
       var item = this.contracts.find((row: any) => { return row.id ==  this.selectionRows[0];})
    
       const dialogConfig = new MatDialogConfig();

       dialogConfig.disableClose = true;
       dialogConfig.autoFocus = false;
       dialogConfig.width = "900px";
       dialogConfig.height = "450px";
       dialogConfig.data = { contract :item };

      const dialogRef = this.dialog.open(ContractItemsComponent, dialogConfig);
     
     }
     else
     {
       alert("Please select Contract!");
     }
   }  

   openGuaranties()
   {
    if (this.selectionRows.length > 0)
    {
       var item = this.contracts.find((row: any) => { return row.id ==  this.selectionRows[0];})
    
       const dialogConfig = new MatDialogConfig();

       dialogConfig.disableClose = true;
       dialogConfig.autoFocus = false;
       dialogConfig.width = "900px";
       dialogConfig.height = "450px";
       dialogConfig.data = { contract :item };

      const dialogRef = this.dialog.open(ContractGuarantiesComponent, dialogConfig);
     
     }
     else
     {
       alert("Please select Contract!");
     }
   }  

   openTermPayments()
   {
    if (this.selectionRows.length > 0)
    {
       var item = this.contracts.find((row: any) => { return row.id ==  this.selectionRows[0];})
    
       const dialogConfig = new MatDialogConfig();

       dialogConfig.disableClose = true;
       dialogConfig.autoFocus = false;
       dialogConfig.width = "800px";
       dialogConfig.height = "450px";
       dialogConfig.data = { contract :item };

      const dialogRef = this.dialog.open(ContractTermPaymentsComponent, dialogConfig);
     
     }
     else
     {
       alert("Please select Contract!");
     }
   }  

   openVPIS()
   {
    if (this.selectionRows.length > 0)
    {
       var item = this.contracts.find((row: any) => { return row.id ==  this.selectionRows[0];})
    
       const dialogConfig = new MatDialogConfig();

       dialogConfig.disableClose = true;
       dialogConfig.autoFocus = false;
       dialogConfig.width = "800px";
       dialogConfig.height = "450px";
       dialogConfig.data = { contract :item };

      const dialogRef = this.dialog.open(VPISListComponent, dialogConfig);
     
     }
     else
     {
       alert("Please select Contract!");
     }
   }  

   openTransmittal()
   {
    if (this.selectionRows.length > 0)
    {
      this.router.navigate([`/home/procurement/contract/transmittal/${this.selectionRows[0]}`]);
     }
     else
     {
       alert("Please select Contract!");
     }
   }
}


