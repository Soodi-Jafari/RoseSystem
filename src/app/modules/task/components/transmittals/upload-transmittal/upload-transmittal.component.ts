import { Component, OnInit, Inject } from '@angular/core';
import { FileRestrictions, RemoveEvent, SelectEvent, SuccessEvent } from '@progress/kendo-angular-upload';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Transmittal } from '../../../models/transmittal';
import { TransmittalService } from '../../../services/transmittal.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';

@Component({
  selector: 'app-upload-transmittal',
  templateUrl: './upload-transmittal.component.html',
  styleUrls: ['./upload-transmittal.component.css']
})
export class UploadTransmittalComponent implements OnInit {

  transmittal: Transmittal;
  errorMessege: string;
  isLoading: boolean;
  uploadSaveUrl = '';
  successMessege: string;
  constructor(public dialogRef: MatDialogRef<UploadTransmittalComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
               public docService: TransmittalService,private globalConfigService: GlobalConfigService) {
    this.transmittal = data;  
   }

  ngOnInit() {

    this.uploadSaveUrl = this.globalConfigService.apiUrl + `/api/files/SaveTransmittalFileInDataCenter/${this.transmittal.customer.title}/${this.transmittal.transmittalNo}/${this.transmittal.projectId}`;
  }

  successEventHandler(e: SuccessEvent) {
    this.updateTransmittal();
    this.successMessege = e.response.body;
    setTimeout(() => {
     this.successMessege = null;
   }, 5000);
 } 

 errorEventHandler(e) {
   this.errorMessege = e.response.error;
   setTimeout(() => {
     this.errorMessege = null;
   }, 5000);
   
 }

  updateTransmittal()
  {
    this.isLoading = true;  
    this.transmittal.isArchived = true;
    this.docService.Post(this.transmittal).subscribe( result => {
        this.isLoading = false; 
      //  this.dialogRef.close(this.transmittal);

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
