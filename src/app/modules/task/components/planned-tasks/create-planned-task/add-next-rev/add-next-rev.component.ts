import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { PlannedTask } from 'src/app/modules/task/models/planned-task';
import { PlannedTaskService } from 'src/app/modules/task/services/planned-task.service';
import { PlannedTaskState } from 'src/app/modules/general/enums/planned-task-state.enum';
import * as _ from 'lodash';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { CommonService } from 'src/app/services/common.service';
import { Position } from 'src/app/modules/general/enums/position.enum';
import { Router } from '@angular/router';
import { EntityType } from 'src/app/modules/general/enums/entity-type.enum';

@Component({
  selector: 'app-add-next-rev',
  templateUrl: './add-next-rev.component.html',
  styleUrls: ['./add-next-rev.component.css']
})
export class AddNextRevComponent implements OnInit {
  isLoading: boolean;
  viewModel : PlannedTask;
  priorities : Array<any>;
  isManager: boolean;
  
  constructor(public taskService : PlannedTaskService,public dialogRef: MatDialogRef<AddNextRevComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private commonService : CommonService,private router : Router) {
    
      this.viewModel = new PlannedTask();  
      this.isManager = false;
}

  ngOnInit() {
    this.priorities = EnumCoding.Priorities;
    this.setDefaultValues(this.data);
    this.setCurrentRole();
  }
   
  setDefaultValues(task: PlannedTask)
  {
    this.viewModel.disciplineId = task.disciplineId;
    this.viewModel.disciplineName = task.disciplineName;
    this.viewModel.projectId = task.projectId;
    this.viewModel.documentNo = task.documentNo;
    this.viewModel.documentTitle = task.documentTitle;
    this.viewModel.priority = this.priorities[1];
    this.viewModel.startDate = this.viewModel.actualStart = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(), 0,0,0);
    this.viewModel.revision = task.revision.split(/(\d+)/)[0] + ( _.parseInt(task.revision.split(/(\d+)/)[1]) + 1 ).toString();
    this.setTaskState();
    }

 setTaskState()
 {
   var roles = this.commonService.CurrentProject.roles;
   var res =  _.maxBy(roles,'positionId');
   if (res.positionId == Position.Expert)
     this.viewModel.currentState = PlannedTaskState.InprogressExpert;
   else
     this.viewModel.currentState = PlannedTaskState.WaitPSL;
 }

 setCurrentRole()
 {
   var roles = this.commonService.CurrentProject.roles;
   var isPsl = _.some(roles, (role : any) => {
      return  role.positionId == Position.Expert || role.positionId == Position.PSL;
   });
   this.isManager = !isPsl;
 }

save(act : number)
  {
    if (isNullOrUndefined(this.viewModel.documentNo) || isNullOrUndefined(this.viewModel.documentTitle) 
         || isNullOrUndefined(this.viewModel.revision) || isNullOrUndefined(this.viewModel.dueDate) || isNullOrUndefined(this.viewModel.estimateManHour))
             {
                  alert("Please enter required fields!");
                  return;
             }

    this.isLoading = true;  
    this.taskService.Post(this.viewModel).subscribe( result => {
        this.isLoading = false;
        if (act == 1)
           this.router.navigate([`/home/task/plannedTaskApproval/${result}`]);     
        else if (act == 2)
           this.router.navigate([`/home/procurement/idc/null/${result}/${EntityType.Task}`]);       
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




