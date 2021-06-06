import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { VendorTransmittalDoc } from '../../../models/vendor-transmittal-doc';
import { VendorTransmittalDocService } from '../../../services/vendor-transmittal-doc.service';
import { LookupValue } from 'src/app/models/lookup-value';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { AttachFile } from 'src/app/models/attach-file';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { EntityType } from 'src/app/modules/general/enums/entity-type.enum';
import { FileOwner } from 'src/app/modules/general/enums/file-owner';
import { SystemType } from 'src/app/modules/general/enums/system-type';

@Component({
  selector: 'app-vendor-transmital-doc-detail',
  templateUrl: './vendor-transmital-doc-detail.component.html',
  styleUrls: ['./vendor-transmital-doc-detail.component.css']
})

export class VendorTransmitalDocDetailComponent implements OnInit {
  isLoading: boolean;
  viewModel : VendorTransmittalDoc;
  isReadonly: boolean;
  transmittalTypes : any;
  @ViewChild("docList") docList;  
  sourceDoc: Array<LookupValue>
  vpiss: Array<LookupValue>
  uploadSaveUrl = '';
  
  @ViewChild("issueList") issueList;  
  sourceIssue: Array<LookupValue>
  purposeOfIssues: Array<LookupValue>

  constructor(public docService : VendorTransmittalDocService,public dialogRef: MatDialogRef<VendorTransmitalDocDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private globalConfigService : GlobalConfigService) {

    this.isReadonly = false;  
    var venTitle = this.data.transmittal.vendor.split('.').join("");
    this.uploadSaveUrl = this.globalConfigService.apiUrl + `/api/files/upload/${SystemType.Procurement}/${venTitle}/${FileOwner.VendorTransmittal}/${this.data.transmittal.transmittalNo}`; 
    this.viewModel = new VendorTransmittalDoc();   
}

  ngOnInit() {
    this.getLookups();
    if (!isNullOrUndefined(this.data.transmittalDocument))
        this.getTransmittalDoc(this.data.transmittalDocument.id);
      
  }

  getTransmittalDoc(id: number)
  {
    this.isLoading = true;
    this.docService.getSingle('GetSingle', id.toString()).subscribe((result: any) => 
     {
        this.isLoading = false;
        this.viewModel = result.model;  
        this.isReadonly = isNullOrUndefined(this.viewModel.currentState) || this.viewModel.currentState == 0 ? false : true;
     }, error => {    
      this.isLoading = false;
    });   
  }

  getLookups()
  {
    this.isLoading = true;
    this.docService.getListLookup('GetLookups',`${this.data.transmittal.contractId}/${this.data.transmittal.transmittalType}`).subscribe((data : any) => 
    {
        this.isLoading = false;
        this.vpiss =  this.sourceDoc = data.vpiss;
        this.purposeOfIssues = this.sourceIssue = data.purposeOfIssues;
    }, error => {    
      this.isLoading = false;
    });   
  }

   
  ngAfterViewInit() {
    const contains = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    this.docList.filterChange.asObservable().pipe(
          switchMap(value => from([this.sourceDoc]).pipe(
              tap(() => this.docList.loading = true),
              delay(1000),
              map((docs) => docs.filter(contains(value)))
          ))
      )
      .subscribe(x => {
          this.vpiss = x;
      });

    const vencontains = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    this.issueList.filterChange.asObservable().pipe(
          switchMap(value => from([this.sourceIssue]).pipe(
              tap(() => this.issueList.loading = true),
              delay(1000),
              map((items) => items.filter(vencontains(value)))
          ))
      )
      .subscribe(x => {
          this.purposeOfIssues = x;
      }); 
  }

  save()
  {
    if (isNullOrUndefined(this.viewModel.vpis) || isNullOrUndefined(this.viewModel.purposeOfIssue) )
             {
                  alert("Please enter required fields!");
                  return;
             }

    if (isNullOrEmptyString(this.viewModel.fileDirection) && this.viewModel.fileAttachs.length == 0)
         {
              alert("Please, attach a file or enter file direction!");
               return;
         }   
    this.isLoading = true;  
    this.viewModel.vendorTransmittalId = this.data.transmittal.id;
    if (this.data.transmittal.transmittalType == 1)
        this.viewModel.currentState = 0;
    this.docService.Post(this.viewModel).subscribe( result => {
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

  onAttachFileChanged(attachFiles : AttachFile[])
  {
     this.viewModel.fileAttachs = attachFiles;
  }

}


