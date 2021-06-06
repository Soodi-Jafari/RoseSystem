import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { AttachFile } from 'src/app/models/attach-file';
import { PlannedTask } from 'src/app/modules/task/models/planned-task';
import { PlannedTaskService } from 'src/app/modules/task/services/planned-task.service';
import { SystemType } from 'src/app/modules/general/enums/system-type';
import { FileOwner } from 'src/app/modules/general/enums/file-owner';
import { PlannedTaskState } from 'src/app/modules/general/enums/planned-task-state.enum';
import * as _ from 'lodash';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';

@Component({
  selector: 'app-create-comment-task',
  templateUrl: './create-comment-task.component.html',
  styleUrls: ['./create-comment-task.component.css']
})
export class CreateCommentTaskComponent implements OnInit {
  isLoading: boolean;
  viewModel : PlannedTask;
  priorities : Array<any>;
  uploadSaveUrl = '';
  
  constructor(public taskService : PlannedTaskService,public dialogRef: MatDialogRef<CreateCommentTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private globalConfigService : GlobalConfigService) {
    
    this.viewModel = new PlannedTask(); 
  
}

  ngOnInit() {
    this.priorities = EnumCoding.Priorities;
    this.setDefaultValues(this.data.task);
  }
   
  setDefaultValues(task: PlannedTask)
  {
    this.viewModel.disciplineId = task.disciplineId;
    this.viewModel.disciplineName = task.disciplineName;
    this.viewModel.projectId = task.projectId;
    this.viewModel.documentNo = task.documentNo;
    this.viewModel.documentTitle = task.documentTitle;
    if (this.data.mode == "comment")
    {
      this.viewModel.parentId = task.id;
      this.viewModel.actualStart =  new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),0,0,0);
      this.viewModel.revision = task.revision.split(/(\d+)/)[0] + ( _.parseInt(task.revision.split(/(\d+)/)[1]) + 1 ).toString();
      this.uploadSaveUrl = this.globalConfigService.apiUrl + `/api/files/upload/${SystemType.Task}/${this.viewModel.documentNo}/${FileOwner.Task}/${this.viewModel.revision}`; 
    }
    else
    {
      this.viewModel.dueDate = task.dueDate;
      this.viewModel.estimateManHour = task.estimateManHour;
      this.uploadSaveUrl = this.globalConfigService.apiUrl + `/api/files/upload/${SystemType.Task}/${this.viewModel.documentNo}/${FileOwner.Task}/Rev0`; 
    }
    
    this.viewModel.priority = this.priorities[1];
    this.viewModel.currentState = PlannedTaskState.WaitPSL;
   
  }

  setFileUrl()
  {
    this.uploadSaveUrl = this.globalConfigService.apiUrl + `/api/files/upload/${SystemType.Task}/${this.viewModel.documentNo}/${FileOwner.Task}/${this.viewModel.revision}`; 
  }
  save()
  {
    if (isNullOrUndefined(this.viewModel.documentNo) || isNullOrUndefined(this.viewModel.revision) 
      || isNullOrUndefined(this.viewModel.dueDate)|| isNullOrUndefined(this.viewModel.estimateManHour) )
             {
                  alert("Please enter required fields!");
                  return;
             }

    this.isLoading = true;  
    this.taskService.Post(this.viewModel).subscribe( result => {
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



