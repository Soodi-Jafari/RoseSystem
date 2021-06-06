import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Transmittal } from '../../../models/transmittal';
import { TransmittalService } from '../../../services/transmittal.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { isNullOrUndefined } from 'util';
import { CommonService } from 'src/app/services/common.service';
import { GuidLookupValue } from 'src/app/models/lookup-value';
import { switchMap, delay, tap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transmittal-detail',
  templateUrl: './transmittal-detail.component.html',
  styleUrls: ['./transmittal-detail.component.css']
})
export class TransmittalDetailComponent implements OnInit {

  @ViewChild("customerList") customerList;
  sourceCustomers: Array<GuidLookupValue>
  customers: Array<GuidLookupValue>
  isLoading: boolean;
  viewModel : Transmittal;
  transmittalTypes : any;
  isNewMode : boolean;

  constructor(public transmittalService : TransmittalService,private commonService : CommonService, public dialogRef: MatDialogRef<TransmittalDetailComponent>,
    private router: Router,@Inject(MAT_DIALOG_DATA) public data: any) {
     
    this.viewModel = new Transmittal();  
    this.isNewMode = true;
    this.transmittalTypes = EnumCoding.TransmittalTypes;
}

  ngOnInit() {

    if (!isNullOrUndefined(this.data) && !isNullOrUndefined(this.data.id))
    {
        this.getTransmittal(this.data.id);
        this.isNewMode = false;
    }
    else if (!isNullOrUndefined(this.data) && isNullOrUndefined(this.data.id)) // for copy transmittal
    {
      this.viewModel= !isNullOrUndefined(this.data) ? this.data : new Transmittal();
      this.getLookups();
    }  
    else{
      this.viewModel.projectId = this.commonService.CurrentProject.id;
      this.viewModel.transmittalDate = new Date();
    } 
  }
  
  ngAfterViewInit() {
    const customerContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    this.customerList.filterChange.asObservable().pipe(
          switchMap(value => from([this.sourceCustomers]).pipe(
              tap(() => this.customerList.loading = true),
              delay(1000),
              map((items) => items.filter(customerContain(value)))
          ))
      )
      .subscribe(x => {
          this.customers = x;
      });   
  }

  getLookups()
  {
    this.isLoading = true;
    if (!isNullOrUndefined(this.viewModel.projectId) && !isNullOrUndefined(this.viewModel.transmittalType))
       this.transmittalService.getListLookup(`${this.viewModel.projectId}/${this.viewModel.transmittalType}`).subscribe((data : any) => 
       {
        this.isLoading = false;
        this.customers = this.sourceCustomers = data.customers;
       });
    else{
      this.customers = this.sourceCustomers = [];
    }   
  }  

  getTransmittal(id: number)
  {
    this.isLoading = true;
    this.transmittalService.getSingle('GetSingle', id.toString()).subscribe((result: any) => 
     {
        this.isLoading = false;
        this.viewModel = result.model;
        this.getLookups();     
     }, error => {    
      this.isLoading = false;
    });  
  }

  onTypeChange()
  {
    this.getLookups();     
  }
  save()
  {
    if (isNullOrUndefined(this.viewModel.transmittalType) || isNullOrUndefined(this.viewModel.transmittalNo) ||
         isNullOrUndefined(this.viewModel.transmittalDate) || isNullOrUndefined(this.viewModel.customer))
             {
                  alert("Please enter required fields!");
                  return;
             }

    this.isLoading = true;      
    this.transmittalService.Post(this.viewModel).subscribe( result => {
        this.isLoading = false;
        this.router.navigate([`/home/document/transmittalDocument/${result}`]);     
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

