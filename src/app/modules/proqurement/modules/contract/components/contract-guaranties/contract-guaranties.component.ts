import { Component, OnInit, Inject } from '@angular/core';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ContractGuaranty } from '../../models/contract-guaranty';
import { State,process } from '@progress/kendo-data-query';
import { ContractGuarantyService } from '../../services/contract-guaranty.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { ContractGuarantyDetailComponent } from './contract-guaranty-detail/contract-guaranty-detail.component';

@Component({
  selector: 'app-contract-guaranties',
  templateUrl: './contract-guaranties.component.html',
  styleUrls: ['./contract-guaranties.component.css']
})
export class ContractGuarantiesComponent implements OnInit {

  
  isLoading : boolean;
  public gridView: GridDataResult;
  public selectionRows: any[] = [];

  private contractGuaranties: ContractGuaranty[] 

  public state: State = {
    skip: 0,
    take: 5      
   };

   constructor(public contractGuarantyService : ContractGuarantyService,private dialog: MatDialog, public dialogRef: MatDialogRef<ContractGuarantiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
     this.isLoading = true;
     this.contractGuaranties = [];
    }

    ngOnInit() {
      this.getContracGuaranties();
    }
    
    private setGrid(): void {      
      this.gridView = process(this.contractGuaranties,this.state);
    }
    
    getContracGuaranties() : void {
         this.contractGuarantyService.getList('GetAll', this.data.contract.id.toString())
         .subscribe( (result : any) =>  {
          this.isLoading = false;
          this.contractGuaranties = result.data;
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
        var item = this.contractGuaranties.find((row: any) => { return row.id ==  this.selectionRows[0];})
        this.openDetail(item);
        }
    }
    
    public openDetail(row : any)
       {
         const dialogConfig = new MatDialogConfig();
     
         dialogConfig.disableClose = true;
         dialogConfig.autoFocus = false;
         dialogConfig.width = "800px";
         dialogConfig.height = "460px";
         dialogConfig.data =  {contract : this.data.contract, contractGuaranty : row};
     
         const dialogRef = this.dialog.open(ContractGuarantyDetailComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(result => {
             if (result !== null)
              this.getContracGuaranties();     
           });            
        }
    
    delete()
     {
        if (this.selectionRows.length > 0)
        { 
         var item = this.contractGuaranties.find((row: any) => { return row.id ==  this.selectionRows[0];})
         if(confirm(`Are you sure to delete  "${item.contractItem.title}"`)) {
           this.isLoading = true;
            this.contractGuarantyService.Delete(item).subscribe( result => {
               this.getContracGuaranties();
             }, error => {
               this.isLoading = false;
               alert(`Guaranty "${item.contractItem.title}" is used. Could not be deleted.`);
           });
         }    
        }
      }      
    
      closeDialog() {
        this.dialogRef.close();
      }
 }
    