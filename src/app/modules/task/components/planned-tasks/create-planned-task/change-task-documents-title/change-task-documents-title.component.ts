import { Component, OnInit, Inject } from '@angular/core';
import { PlannedTaskService } from 'src/app/modules/task/services/planned-task.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-change-task-documents-title',
  templateUrl: './change-task-documents-title.component.html',
  styleUrls: ['./change-task-documents-title.component.css']
})
export class ChangeTaskDocumentsTitleComponent implements OnInit {

  isLoading: boolean;
  viewModel: any;

  constructor(public taskService: PlannedTaskService, public dialogRef: MatDialogRef<ChangeTaskDocumentsTitleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  
  }

  ngOnInit() {
    this.viewModel = {};
    if (!isNullOrUndefined(this.data))
      this.getTask(this.data.id);
  }

  getTask(id: number) {
    this.isLoading = true;
    this.taskService.getSingle('GetSingle', id.toString()).subscribe((result: any) => {
      this.isLoading = false;
      this.viewModel = result.model;
    }, error => {
      this.isLoading = false;
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  save() {
    if (!isNullOrEmptyString(this.viewModel.newDocumentTitle) || !isNullOrEmptyString(this.viewModel.newDocumentNo)) {
      if (confirm(`Are you sure to Change Document No. or Document Title of  "${this.viewModel.documentNo}"`)) {

        this.isLoading = true;
        this.viewModel.documentTitle = !isNullOrEmptyString(this.viewModel.newDocumentTitle) ? this.viewModel.newDocumentTitle : this.viewModel.documentTitle;
        this.viewModel.documentNo = !isNullOrEmptyString(this.viewModel.newDocumentNo) ? this.viewModel.newDocumentNo : this.viewModel.documentNo;
        this.taskService.editTask(this.viewModel).subscribe(result => {
          this.isLoading = false;
          this.dialogRef.close(this.viewModel);          
        }, error => {
          this.isLoading = false;
          var errMessage = '';
          if (error.error.length > 0)
            error.error.forEach((err: string) => errMessage = errMessage + err + '\n');
          else
            errMessage = error.error.ExceptionMessage;

          alert(errMessage);
        });
      }
    }
    else {
      alert("Please Enter Document Title!");
    }
  }

}
