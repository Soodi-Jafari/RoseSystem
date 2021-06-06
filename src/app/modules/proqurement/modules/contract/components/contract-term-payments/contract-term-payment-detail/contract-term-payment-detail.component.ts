import { Component, OnInit, Inject } from '@angular/core';
import { ContractTermPayment } from '../../../models/contract-term-payment';
import { ContractTermPaymentService } from '../../../services/contract-term-payment.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';

@Component({
  selector: 'app-contract-term-payment-detail',
  templateUrl: './contract-term-payment-detail.component.html',
  styleUrls: ['./contract-term-payment-detail.component.css']
})
export class ContractTermPaymentDetailComponent implements OnInit {
  isLoading: boolean;
  viewModel : ContractTermPayment;
  paymentTypes : any;

  constructor(public paymentService : ContractTermPaymentService,public dialogRef: MatDialogRef<ContractTermPaymentDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
     
    this.viewModel = new ContractTermPayment();   
    this.paymentTypes = EnumCoding.PaymentTypes;
    
}


  ngOnInit() {
    if (!isNullOrUndefined(this.data.contractPayment))
        this.getContractItem(this.data.contractPayment.id);
  }

  getContractItem(id: number)
  {
    this.isLoading = true;
    this.paymentService.getSingle('GetSingle', id.toString()).subscribe((result: any) => 
     {
        this.isLoading = false;
        this.viewModel = result.model;  
     }, error => {    
      this.isLoading = false;
    });   
  }

  save()
  {
    if (isNullOrUndefined(this.viewModel.paymentType))
             {
                  alert("Please enter required fields!");
                  return;
             }
    this.isLoading = true;  
    this.viewModel.contractId = this.data.contract.id;
    this.paymentService.Post(this.viewModel).subscribe( result => {
        this.isLoading = false;
        this.dialogRef.close(this.viewModel);
    }, error => {
      this.isLoading = false;
      var errMessage ='';
      if (error.error.length > 0)
          error.error.forEach((err: string) => errMessage = errMessage +  err + '\n');           
      else
        errMessage = error.error.ExceptionMessage;
  
      alert(errMessage);
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
