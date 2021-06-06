import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { AttachFile } from 'src/app/models/attach-file';
import { TransmittalDocument } from '../../../models/transmittal-document';
import { SystemType } from 'src/app/modules/general/enums/system-type';
import { FileOwner } from 'src/app/modules/general/enums/file-owner';
import { PlannedTaskService } from '../../../services/planned-task.service';

@Component({
  selector: 'app-comment-files',
  templateUrl: './comment-files.component.html',
  styleUrls: ['./comment-files.component.css']
})
export class CommentFilesComponent implements OnInit {

  isLoading: boolean;
  viewModel : TransmittalDocument;
  isReadonly: boolean;
  uploadSaveUrl = '';

  constructor(public dialogRef: MatDialogRef<CommentFilesComponent>,public docService : PlannedTaskService,
    @Inject(MAT_DIALOG_DATA) public data: any, private globalConfigService : GlobalConfigService) {

    this.isReadonly = false;  
    this.uploadSaveUrl = this.globalConfigService.apiUrl + `/api/files/upload/${SystemType.Transmittal}/${data.documentNo}/${FileOwner.TransmittalDocument}/${data.transmittal.transmittalNo}`; 
    this.viewModel = data;   
}

  ngOnInit() {   
    if (this.viewModel.fileAttachs.length > 0)
       {
        this.isReadonly = true;
       }
  }
   
  save()
  {
    if (this.viewModel.fileAttachs.length == 0)
         {
              alert("Please, attach a file or enter file direction!");
               return;
         }  
         
         this.viewModel.fileAttachs.forEach(file => {
          this.saveFileInDataCenter(file.path);
        });

        this.dialogRef.close(this.viewModel);
   
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onAttachFileChanged(attachFiles : AttachFile[])
  {
     this.viewModel.fileAttachs = attachFiles;
  }

  saveFileInDataCenter(sourceUrl: string)
  {
    var model = {
      sourceUrl: sourceUrl,
      projectId: this.viewModel.projectId,
      discipline: this.viewModel.disciplineName,
      docNo: this.viewModel.documentNo,
      type : "Comments",
      client: this.viewModel.transmittal.customer.title,
      transmittalNo: this.viewModel.transmittal.transmittalNo,
      rev: this.viewModel.revision      
    }

    this.docService.saveFileDataCenter(model).subscribe( result => {
     
    }, error => {
    });
  }
}


