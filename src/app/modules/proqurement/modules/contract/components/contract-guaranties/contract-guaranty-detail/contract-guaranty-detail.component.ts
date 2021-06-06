import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ContractGuaranty } from '../../../models/contract-guaranty';
import { LookupValue } from 'src/app/models/lookup-value';
import { ContractGuarantyService } from '../../../services/contract-guaranty.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { from } from 'rxjs';
import { switchMap, tap, delay, map } from 'rxjs/operators';

@Component({
  selector: 'app-contract-guaranty-detail',
  templateUrl: './contract-guaranty-detail.component.html',
  styleUrls: ['./contract-guaranty-detail.component.css']
})
export class ContractGuarantyDetailComponent implements OnInit {

  @ViewChild("itemList") itemList;
  
  isLoading: boolean;
  viewModel : ContractGuaranty;
  sourceItems: Array<LookupValue>  
  items: Array<LookupValue> 
 
  constructor(public contractService : ContractGuarantyService,public dialogRef: MatDialogRef<ContractGuarantyDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.viewModel = new ContractGuaranty();   
    this.isLoading = true;
  }

  ngOnInit() {
    this.setLookups();
    if (!isNullOrUndefined(this.data.contractGuaranty))
        this.getcontractGuaranty(this.data.contractGuaranty.id);
  }

ngAfterViewInit() {
 
    const contains = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    this.itemList.filterChange.asObservable().pipe(
          switchMap(value => from([this.sourceItems]).pipe(
              tap(() => this.itemList.loading = true),
              delay(1000),
              map((docs) => docs.filter(contains(value)))
          ))
      )
      .subscribe(x => {
          this.items = x;
      });    
  }

  getcontractGuaranty(id: number)
  {
    this.isLoading = true;
    this.contractService.getSingle('GetSingle', id.toString()).subscribe((result: any) => 
     {
        this.isLoading = false;
        this.viewModel = result.model;  
     }, error => {    
      this.isLoading = false;
  });     
  }

  setLookups()
  {
    this.contractService.getContractItems(this.data.contract.id.toString()).subscribe((result : any) => 
    {
        this.isLoading = false;
        this.items = this.sourceItems =  result.data;
    }, error => {    
      this.isLoading = false;
  });     
  }

  save()
  {
    if (isNullOrUndefined(this.viewModel.contractItem))
             {
                  alert("Please enter required fields!");
                  return;
             }
    this.isLoading = true;  
    this.contractService.Post(this.viewModel).subscribe( result => {
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
