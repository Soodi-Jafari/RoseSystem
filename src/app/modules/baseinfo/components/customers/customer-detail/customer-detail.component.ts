import { Component, OnInit, Inject } from '@angular/core';
import { GuidLookupValue } from 'src/app/models/lookup-value';
import { Customer } from '../../../models/customer';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomerService } from '../../../services/customer.service';
import { isNullOrUndefined } from 'util';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  
  viewModel : Customer;
  public customerTypes: Array<GuidLookupValue>
  isLoading : boolean;
 
  constructor(public customerService : CustomerService, public dialogRef: MatDialogRef<CustomerDetailComponent>,
                   @Inject(MAT_DIALOG_DATA) public data: any) {
   }
 
  ngOnInit(){
    this.viewModel = new Customer();
    if (!isNullOrUndefined(this.data))
        this.getItem(this.data.id);
    
    this.getLookups();   
  }
 
 
  getItem(id: number)
  {
    this.isLoading = true;
    this.customerService.getSingle('GetSingle',`${id}`).subscribe((result : any) => {
      this.isLoading = false;
      this.viewModel = result.model;
     }, error => {    
      this.isLoading = false;
  });     
  }
 
  getLookups()
  {
    this.customerService.getCustomerTypes().subscribe((data : any) => 
    {
        this.isLoading = false;
        this.customerTypes = data.data;
    }, error => {    
      this.isLoading = false;
  });     
  }
  
  save()
  {
    if (isNullOrEmptyString(this.viewModel.customerName) || isNullOrUndefined(this.viewModel.customerType))
             {
                  alert("Please enter required fields!");
                   return;
             }
    this.isLoading = true;
    this.customerService.Post(this.viewModel).subscribe( result => {
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
 