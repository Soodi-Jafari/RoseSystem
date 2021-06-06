import { Component, OnInit, Inject } from '@angular/core';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ContractItem } from '../../models/contract-item';
import { State,process } from '@progress/kendo-data-query';
import { ContractItemService } from '../../services/contract-item.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { ContractItemDetailComponent } from './contract-item-detail/contract-item-detail.component';

@Component({
  selector: 'app-contract-items',
  templateUrl: './contract-items.component.html',
  styleUrls: ['./contract-items.component.css']
})
export class ContractItemsComponent implements OnInit {

  isLoading : boolean;
  public gridView: GridDataResult;
  public selectionRows: any[] = [];

  private contractItems: ContractItem[] 

  public state: State = {
    skip: 0,
    take: 5      
   };

   constructor(public contractItemService : ContractItemService,private dialog: MatDialog, public dialogRef: MatDialogRef<ContractItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
     this.isLoading = true;
     this.contractItems = [];
    }

    ngOnInit() {
      this.getContracItems();
    }
    
    private setGrid(): void {      
      this.gridView = process(this.contractItems,this.state);
    }
    
    getContracItems() : void {
         this.contractItemService.getList('GetAll', this.data.contract.id.toString())
         .subscribe( (result : any) =>  {
          this.isLoading = false;
          this.contractItems = result.data;
          this.setGrid();   
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
        var item = this.contractItems.find((row: any) => { return row.id ==  this.selectionRows[0];})
        this.openDetail(item);
        }
    }
    
    public openDetail(row : any)
       {
         const dialogConfig = new MatDialogConfig();     
         dialogConfig.disableClose = true;
         dialogConfig.autoFocus = false;
         dialogConfig.width = "800px";
         dialogConfig.height = "560px";
         dialogConfig.data =  {contract : this.data.contract,contractItem : row};         
         const dialogRef = this.dialog.open(ContractItemDetailComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(result => {
             if (result !== null)
              this.getContracItems();     
           });            
        }
    
    delete()
      {
        if (this.selectionRows.length > 0)
        { 
         var item = this.contractItems.find((row: any) => { return row.id ==  this.selectionRows[0];})
         if(confirm(`Are you sure to delete  "${item.mrpItem.title}"`)) {
           this.isLoading = true;
            this.contractItemService.Delete(item).subscribe( result => {
               this.getContracItems();
             }, error => {

               this.isLoading = false;
               alert(`Item "${item.mrpItem.title}" is used. Could not be deleted.`);
           });
         }    
        }
      }      
    
      closeDialog() {
        this.dialogRef.close();
      }
 }
    