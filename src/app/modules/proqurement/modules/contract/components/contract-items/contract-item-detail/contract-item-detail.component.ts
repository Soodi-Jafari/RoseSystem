import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ContractItem } from '../../../models/contract-item';
import { LookupValue } from 'src/app/models/lookup-value';
import { ContractItemService } from '../../../services/contract-item.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-contract-item-detail',
  templateUrl: './contract-item-detail.component.html',
  styleUrls: ['./contract-item-detail.component.css']
})
export class ContractItemDetailComponent implements OnInit {

  @ViewChild("itemList") itemList;
  
  isLoading: boolean;
  viewModel : ContractItem;
  sourceItems: Array<LookupValue>  
  items: Array<LookupValue> 
  units: Array<LookupValue>
  isEditMode : boolean;
 
  constructor(public contractService : ContractItemService,public dialogRef: MatDialogRef<ContractItemDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.isEditMode = data === null ? false : true;        
    this.viewModel = new ContractItem();   
    this.isLoading = true;
}

  ngOnInit() {
    this.getLookups();
    if (!isNullOrUndefined(this.data.contractItem))
        this.getContractItem(this.data.contractItem.id);
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

  getContractItem(id: number)
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

  getLookups()
  {
    this.contractService.getListLookup('GetLookups',this.data.contract.mrpId.toString()).subscribe((data : any) => 
    {
        this.isLoading = false;
        this.units =  data.currencyUnits;
        this.items = this.sourceItems =  data.mrpItems;
    }, error => {    
      this.isLoading = false;
  });     
  }

  save()
  {
    if (isNullOrUndefined(this.viewModel.mrpItem) || isNullOrUndefined(this.viewModel.quantity))
             {
                  alert("Please enter required fields!");
                  return;
             }
    this.isLoading = true;  
    this.viewModel.contractId = this.data.contract.id;
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
