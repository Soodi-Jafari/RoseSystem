import { Component, OnInit, Inject } from '@angular/core';
import { PlannedTask } from '../../../models/planned-task';
import { PlannedTaskService } from '../../../services/planned-task.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-edit-plan-task',
  templateUrl: './edit-plan-task.component.html',
  styleUrls: ['./edit-plan-task.component.css']
})
export class EditPlanTaskComponent implements OnInit {

  isLoading: boolean;
  viewModel : PlannedTask;
  
  constructor(public taskService : PlannedTaskService,public dialogRef: MatDialogRef<EditPlanTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    
      this.viewModel = new PlannedTask();  
}

  ngOnInit() {
    if (!isNullOrUndefined(this.data))
       this.getTask(this.data.id);
  }
   
  getTask(id: number)
  {
    this.isLoading = true;
    this.taskService.getSingle('GetSingle', id.toString()).subscribe((result: any) => {
      this.isLoading = false;
      this.viewModel = result.model;
    }, error => {    
      this.isLoading = false;
    });  
  }

save()
  {
    this.isLoading = true;  
    this.taskService.editTask(this.viewModel).subscribe( result => {
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
