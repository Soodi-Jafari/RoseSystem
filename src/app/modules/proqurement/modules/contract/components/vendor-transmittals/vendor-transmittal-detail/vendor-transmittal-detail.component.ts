import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { VendorTransmittal } from '../../../models/vendor-transmittal';
import { VendorTransmittalService } from '../../../services/vendor-transmittal.service';
import { TransmittalDialogData } from '../vendor-transmittals.component';

@Component({
  selector: 'app-vendor-transmittal-detail',
  templateUrl: './vendor-transmittal-detail.component.html',
  styleUrls: ['./vendor-transmittal-detail.component.css']
})

export class VendorTransmittalDetailComponent implements OnInit {
  isLoading: boolean;
  viewModel : VendorTransmittal;
  transmittalTypes : any;

  constructor(public transmittalService : VendorTransmittalService,public dialogRef: MatDialogRef<VendorTransmittalDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransmittalDialogData) {
     
    this.viewModel = new VendorTransmittal();   
    this.transmittalTypes = EnumCoding.VendorTransmittalTypes;
}

  ngOnInit() {
    if (!isNullOrUndefined(this.data.transmittal))
        this.getTransmittal(this.data.transmittal.id);
  }

  getTransmittal(id: number)
  {
    this.isLoading = true;
    this.transmittalService.getSingle('GetSingle', id.toString()).subscribe((result: any) => 
     {
        this.isLoading = false;
        this.viewModel = result.model;  
     }, error => {    
      this.isLoading = false;
    });  
  }

  save()
  {
    if (isNullOrUndefined(this.viewModel.transmittalType) || isNullOrUndefined(this.viewModel.transmittalNo) || isNullOrUndefined(this.viewModel.transmittalDate))
             {
                  alert("Please enter required fields!");
                  return;
             }

    this.isLoading = true;  
    this.viewModel.contractId = this.data.contract.id;
    this.viewModel.projectId = this.data.contract.projectId;
    this.transmittalService.Post(this.viewModel).subscribe( result => {
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

