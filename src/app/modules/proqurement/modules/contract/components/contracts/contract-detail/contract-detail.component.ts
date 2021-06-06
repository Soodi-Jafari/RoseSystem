
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { LookupValue } from 'src/app/models/lookup-value';
import { CommonService } from 'src/app/services/common.service';
import { isNullOrUndefined } from 'util';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { Contract } from '../../../models/contract';
import { MRP } from '../../../../mrp/models/mrp';
import { ContractService } from '../../../services/contract.service';
import * as _ from 'lodash';

export interface DialogData {
  id: number;
  //isEdit;
}


@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.css']
})
export class ContractDetailComponent implements OnInit {

  @ViewChild("mrpList") mrpList;
  @ViewChild("vendorList") vendorList;
 
  isLoading: boolean;
  viewModel : Contract;
  mrps: Array<MRP>
  sourceMrps: Array<LookupValue> 
  sourceVendors: Array<LookupValue> 
  vendors: Array<LookupValue> 
  units: Array<LookupValue>
  isEditMode : boolean;

  constructor(public contractService : ContractService,public commonService :CommonService,public dialogRef: MatDialogRef<ContractDetailComponent>,
                   @Inject(MAT_DIALOG_DATA) public data: DialogData) {

         this.isEditMode = data === null ? false : true;        
         this.viewModel = new Contract();   
         this.isLoading = true;
   }

  ngOnInit(){
    
    this.getLookups();
    if (!this.isEditMode)
    {
       this.getMRPLookup();
    }
 
    if (!isNullOrUndefined(this.data))
        this.getContract(this.data.id);
  }
 
  ngAfterViewInit() {
    if (!this.isEditMode)
    {
    const contains = value => s => s.mrpNo.toLowerCase().indexOf(value.toLowerCase()) !== -1;

    this.mrpList.filterChange.asObservable().pipe(
          switchMap(value => from([this.sourceMrps]).pipe(
              tap(() => this.mrpList.loading = true),
              delay(1000),
              map((docs) => docs.filter(contains(value)))
          ))
      )
      .subscribe(x => {
          this.mrps = x;
      });
    

    const vencontains = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;

    this.vendorList.filterChange.asObservable().pipe(
          switchMap(value => from([this.sourceVendors]).pipe(
              tap(() => this.vendorList.loading = true),
              delay(1000),
              map((items) => items.filter(vencontains(value)))
          ))
      )
      .subscribe(x => {
          this.vendors = x;
      }); 
    }
  }

  getContract(id: number)
  {
    this.contractService.getSingle('GetSingle', id.toString()).subscribe((result: any) => 
     {
      this.isLoading = false;
      this.viewModel = result.model;  
     }, error => {    
      this.isLoading = false;
    });   
  }
  
  getMRPLookup()
  {
    this.contractService.GetMrps(`${this.commonService.CurrentProject.id}/null`).subscribe((result : any) =>     {
       this.mrps =  this.sourceMrps =  result.data;
       this.isLoading = false;      
    }, error => {    
      this.isLoading = false;
    });   
  }

  getVendorsLookup(mrpId)
  {
    this.contractService.GetMrpVendors(mrpId).subscribe((result : any) =>     {
       this.vendors =  this.sourceVendors =  result.data;
    });
  }

  getLookups()
  {
    this.contractService.getListLookup('GetLookups').subscribe((data : any) => 
    {
        this.units =  data.currencyUnits;
    });
  }

  public mrpSelectionChange(value: any): void {

    if (!isNullOrUndefined(value))
    {
       this.getVendorsLookup(value.id);
       var lst = _.split(value.title.toLowerCase(),' for ');
       this.viewModel.subject = lst.length > 1 ? lst[1] : "";
    }
    else
       this.vendors = this.sourceVendors = [];
  }

  save()
  {
    if ((!this.isEditMode && (isNullOrUndefined(this.viewModel.mrpVendor) || isNullOrUndefined(this.viewModel.mrp)) )
         || isNullOrEmptyString(this.viewModel.poNo) || isNullOrUndefined(this.viewModel.poDate))
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


