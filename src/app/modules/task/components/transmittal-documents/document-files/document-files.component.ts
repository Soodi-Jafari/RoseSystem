import { Component, OnInit, Inject } from '@angular/core';
import { TransmittalDocumentService } from '../../../services/transmittal-document.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApprovalFlow } from 'src/app/models/approval-flow';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-document-files',
  templateUrl: './document-files.component.html',
  styleUrls: ['./document-files.component.css']
})
export class DocumentFilesComponent implements OnInit {

  isLoading: boolean;
  viewModel : ApprovalFlow;

  constructor(public transmittalService : TransmittalDocumentService, public dialogRef: MatDialogRef<DocumentFilesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
     
    this.viewModel = new ApprovalFlow();  
}

  ngOnInit() {
    if (!isNullOrUndefined(this.data))
    {
        this.getTaskDocumentFile(this.data.taskId);
    }
  }
  
  getTaskDocumentFile(id: number)
  {
    this.isLoading = true;
    this.transmittalService.getSingle('ApprovedDocumentFile', id.toString()).subscribe((result: any) => 
     {
        this.isLoading = false;
        this.viewModel = result.model;
     }, error => {    
      this.isLoading = false;
    });  
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
