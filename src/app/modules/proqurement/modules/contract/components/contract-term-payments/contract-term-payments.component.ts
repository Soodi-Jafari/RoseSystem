import { Component, OnInit, Inject } from '@angular/core';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ContractTermPayment } from '../../models/contract-term-payment';
import { ContractTermPaymentService } from '../../services/contract-term-payment.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { State,process } from '@progress/kendo-data-query';
import { ContractTermPaymentDetailComponent } from './contract-term-payment-detail/contract-term-payment-detail.component';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';

@Component({
  selector: 'app-contract-term-payments',
  templateUrl: './contract-term-payments.component.html',
  styleUrls: ['./contract-term-payments.component.css']
})
export class ContractTermPaymentsComponent implements OnInit {

  isLoading : boolean;
  public gridView: GridDataResult;
  public selectionRows: any[] = [];

  private payments: ContractTermPayment[] 

  public state: State = {
    skip: 0,
    take: 5      
   };

   constructor(public paymentService : ContractTermPaymentService,private dialog: MatDialog, public dialogRef: MatDialogRef<ContractTermPaymentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
     this.isLoading = true;
     this.payments = [];
    }

    ngOnInit() {
      this.getAll();
    }
    
    private setGrid(): void {      
      this.gridView = process(this.payments,this.state);
    }
    
    getAll() : void {
         this.paymentService.getList('GetAll', this.data.contract.id.toString())
         .subscribe( (result : any) =>  {
          this.isLoading = false;
          this.payments = result.data;
          this.setGrid();   
         }, error => {    
          this.isLoading = false;
        });     
       }
     
       public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.setGrid();
    }
    
    getPaymentTypeTitle(id)
    {
      if (!isNullOrUndefined(id))
        return EnumCoding.PaymentTypes.find((t : any) => t.id == id).title;
    }

   public new()
       {
         this.openDetail(null);
       }
     
       
    public edit()
    {
        if (this.selectionRows.length > 0)
        {
        var item = this.payments.find((row: any) => { return row.id ==  this.selectionRows[0];})
        this.openDetail(item);
        }
    }
    
    public openDetail(row : any)
       {
         const dialogConfig = new MatDialogConfig();
     
         dialogConfig.disableClose = true;
         dialogConfig.autoFocus = false;
         dialogConfig.width = "700px";
         dialogConfig.height = "350px";
         dialogConfig.data =  {contract : this.data.contract,contractPayment : row};
     
     
         const dialogRef = this.dialog.open(ContractTermPaymentDetailComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(result => {
             if (result !== null)
              this.getAll();     
           });            
        }
    
    delete()
      {
        if (this.selectionRows.length > 0)
        { 
         var item = this.payments.find((row: any) => { return row.id ==  this.selectionRows[0];})
         if(confirm(`Are you sure to delete object`)) {
           this.isLoading = true;
            this.paymentService.Delete(item).subscribe( result => {
               this.getAll();
             }, error => {

               this.isLoading = false;
               alert(`Item is used. Could not be deleted.`);
           });
         }
    
        }
      }      
    
      closeDialog() {
        this.dialogRef.close();
      }
 }
