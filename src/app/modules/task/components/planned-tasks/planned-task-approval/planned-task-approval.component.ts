import { Component, OnInit } from '@angular/core';
import { Observer } from 'src/app/home/observer/observer';
import { PlannedTask } from '../../../models/planned-task';
import { PlannedTaskService } from '../../../services/planned-task.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { Subject } from 'src/app/home/observer/subject';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { isNullOrUndefined } from 'util';
import { Role } from 'src/app/models/project';
import { Position } from 'src/app/modules/general/enums/position.enum';
import { SystemType } from 'src/app/modules/general/enums/system-type';
import { FileOwner } from 'src/app/modules/general/enums/file-owner';
import { AttachFile } from 'src/app/models/attach-file';
import { ApprovalFlow } from 'src/app/models/approval-flow';
import { PlannedTaskState } from 'src/app/modules/general/enums/planned-task-state.enum';
import { LookupValue } from 'src/app/models/lookup-value';
import { Idc } from 'src/app/modules/proqurement/models/idc';
import { IdcService } from 'src/app/modules/proqurement/services/idc.service';
import { EntityType } from 'src/app/modules/general/enums/entity-type.enum';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State,process } from '@progress/kendo-data-query';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Component({
  selector: 'app-planned-task-approval',
  templateUrl: './planned-task-approval.component.html',
  styleUrls: ['./planned-task-approval.component.css']
})
export class PlannedTaskApprovalComponent implements OnInit,Observer {

  isLoading : boolean;
  viewModel : PlannedTask;
  expertUsers: Array<LookupValue>;
 // isOwner: boolean;
  isCurrentDiscipline: boolean;
  uploadSaveUrl = ''; 
  commentViewModel : any;
  planTimeModel: any;
  timeErrorMessage: string;
  timeWarningMessage: string;
  disabledUpload: boolean;
  idc: Idc;
  public gridView: GridDataResult;  
  state: State = {
    skip: 0
  };
  
  constructor(public docService : PlannedTaskService,private globalConfigService : GlobalConfigService,public subject: Subject,
    private router : Router,private route: ActivatedRoute,private idcService: IdcService) { 
      this.viewModel = new PlannedTask();
      this.planTimeModel = {};
      this.commentViewModel = {};
      this.commentViewModel.fileAttachs = [];
      this.isCurrentDiscipline = false;     
    //  this.isOwner = false;
      this.subject.attach(this);
      this.viewModel.id = parseInt(this.route.snapshot.paramMap.get('id'))
   }

   ngOnInit() {
    if (!_.isNaN(this.viewModel.id))
    {
        this.getTask();
        this.getIDC();
    }    
  }

  refresh(): void {
    this.setOwner(); 
  }

  getCurrentDiscipline()
  { 
    if (!isNullOrUndefined(this.subject.getState()))
    {
      var role = _.filter(this.subject.getState().roles, (role : Role) => {
         return  role.positionId == Position.PSL ||  role.positionId == Position.Expert;
       });
       return role;
    }
    else
       return null;
  }
    
  getExperts()
  {
    this.docService.getUserExpertLookup(`${this.viewModel.projectId}/${this.viewModel.disciplineId}`).subscribe((result : any) => 
    {
      this.expertUsers = result.data
    });
  }

  hasPosition(pos: number)
  { 
    var res =  _.some(this.subject.getState().roles, (role : any) => {
      return  role.positionId == pos;
     });
     return res;
  }
 
  getTask()
  {
    this.isLoading = true;
    this.docService.getSingle('GetSingle', `${this.viewModel.id}`).subscribe((result : any) =>
    {
      this.isLoading = false;
      this.viewModel = result.model;
      this.getPlanTaskedTime();
      if (isNullOrUndefined(this.subject.getState()) || this.viewModel.projectId != this.subject.getState().id)
           this.subject.projectId = this.viewModel.projectId;
      var rev = !isNullOrEmptyString(this.viewModel.revision) ? this.viewModel.revision :"Rev"
      this.uploadSaveUrl = this.globalConfigService.apiUrl + `/api/files/upload/${SystemType.Task}/${this.viewModel.documentNo}/${FileOwner.TaskApproval}/${rev}`;    
      if (isNullOrUndefined(this.viewModel.fileAttachs))
           this.viewModel.fileAttachs = [];
      this. setOwner(); 
      this.getExperts();  
    }, error => {    
      this.isLoading = false;
    });     
  }
  
  getPlanTaskedTime()
  { 
     var filter = {
      projId: this.viewModel.projectId,
      documentNo: this.viewModel.documentNo, 
      taskId: this.viewModel.id,
      disciplineId: this.viewModel.disciplineId
    }
     this.docService.getDocumentPlanTimesheetTime(filter).subscribe((result : any) =>
     {
       this.planTimeModel = result;
       this.setPlanedTimeMessage();
     }, error => {    

     }); 
  }

  setOwner()
  {
    if (!isNullOrUndefined(this.getCurrentDiscipline()))
    {
      this.isCurrentDiscipline = _.some(this.getCurrentDiscipline(), (item : any) => {
        return item.disciplineId == this.viewModel.disciplineId
       });      
    }     
  }
  
  onAttachFileChanged(attachFiles : AttachFile[])
  {
     this.commentViewModel.fileAttachs = attachFiles;
  }

  saveState(state: ApprovalFlow)
  {
    this.isLoading = true;
    state.entityId = this.viewModel.id;
    state.rev = this.viewModel.revision;
    this.docService.ChangeState(state).subscribe( result => {
      this.isLoading = false;
      this.router.navigate([`/home/task/plannedTaskList`]);
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

  getPath(filepath: string)
  {
    return this.globalConfigService.apiUrl + '/' + filepath;
  }

  toIdc()
  {
    if (isNullOrUndefined(this.idc))
      this.router.navigate([`/home/procurement/idc/null/${this.viewModel.id}/${EntityType.Task}`]);
    else
      this.router.navigate([`/home/procurement/idc/${this.idc.id}/${this.viewModel.id}/${EntityType.Task}`]);
  }

  getIDC()
  {
     this.idcService.getEntityIdc('EntityIdc', `${this.viewModel.id}/${EntityType.Task}`).subscribe((result : any) =>
     {
         this.idc = result.model;
         if (!isNullOrUndefined(result.model))
             this.gridView = process(this.idc.distributions,this.state);
     });   
  }
  getStatusTitle(id)
  {
    if (!isNullOrUndefined(id))
      return EnumCoding.IDCResponseStatus.find((t : any) => t.id == id).title;
  }

  expertSubmit()
  {
    if (isNullOrEmptyString(this.viewModel.revision))
        {
             alert("Please enter Document Revision!");
             return;
        }

   /*  if (this.commentViewModel.length == 0)
        {
             alert("Please Attach Document!");
             return;
        }    */
     var state = new ApprovalFlow();
     state.flowState = PlannedTaskState.WaitPSL;
     //state.fileDirection = this.commentViewModel.fileDirection;
     state.flowAttachs = this.commentViewModel.fileAttachs;
     state.comment = this.commentViewModel.comment;
     this.saveState(state);
  }

  toExpert()
  {
    if (isNullOrUndefined(this.commentViewModel.toExpert))
    {
         alert("Please Select Expert User!");
          return;
    }

    var state = new ApprovalFlow();
    state.flowState = PlannedTaskState.InprogressExpert; 
    state.expertUserId = this.commentViewModel.toExpert.id;
    state.flowAttachs = this.commentViewModel.fileAttachs;
    state.comment = this.commentViewModel.comment;
    this.saveState(state);    
  }

  pslSubmit()
  {
    if (isNullOrEmptyString(this.viewModel.revision))
    {
         alert("Please enter Document Revision!");
         return;
    }
      var state = new ApprovalFlow();
      state.flowState = PlannedTaskState.WaitingForQA; 
      var lastState = _.last(this.viewModel.approvalStates);
      state.flowAttachs = this.commentViewModel.fileAttachs.length > 0 ? this.commentViewModel.fileAttachs :
                           !isNullOrUndefined(lastState) && lastState.flowState == PlannedTaskState.WaitPSL ? lastState.flowAttachs : [];
      state.comment = !isNullOrEmptyString(this.commentViewModel.comment) ? this.commentViewModel.comment :  !isNullOrUndefined(lastState) && lastState.flowState == PlannedTaskState.WaitPSL ? lastState.comment : this.commentViewModel.comment ;  
     // state.fileDirection =  !isNullOrUndefined(lastState) && lastState.flowState == PlannedTaskState.WaitPSL ? this.commentViewModel.fileDirection : this.viewModel.approvalStates.length > 0 ? lastState.fileDirection : null;  
     
   /*  if (state.flowAttachs.length == 0)
    {
         alert("Please Attach Document!");
         return;
    }    */
    
     this.saveState(state);       
  }

  approve(docState : PlannedTaskState)
  {
    var state = new ApprovalFlow();
       state.flowState = docState;
     //  state.fileDirection = _.last(this.viewModel.approvalStates).fileDirection;
       state.flowAttachs = _.last(this.viewModel.approvalStates).flowAttachs;
       state.comment = this.commentViewModel.comment;
       this.saveState(state);
  }

  reject(docState : PlannedTaskState)
  {
    var state = new ApprovalFlow();
    state.flowState = docState; 
  //  state.fileDirection = this.commentViewModel.fileDirection;
    state.flowAttachs = this.commentViewModel.fileAttachs;
    state.comment = this.commentViewModel.comment;
    this.saveState(state);
  }

  dccApprove()
  {
    this.approve(PlannedTaskState.Completed)
    var files = _.last(this.viewModel.approvalStates).flowAttachs;
    files.forEach(file => {
      this.saveFileInDataCenter(file.path);
    });
  }

  returnPreStep()
  {
    if(confirm(`By this action current step will be deleted. Are you sure to return Previous step?`)) {
      this.isLoading = true;
      this.docService.ReturnToPreStep(this.viewModel).subscribe( result => {
        this.isLoading = false;
       // this.router.navigate([`/home/task/plannedTaskList`]);
         this.getTask();
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
  }

  saveFileInDataCenter(sourceUrl: string)
  {
    var model = {
      sourceUrl: sourceUrl,
      projectId: this.viewModel.projectId,
      discipline: this.viewModel.disciplineName,
      docNo: this.viewModel.documentNo,
      type : "Documents",
      rev: this.viewModel.revision      
    }

    this.docService.saveFileDataCenter(model).subscribe( result => {
     
    }, error => {
      console.log(`Dialog result: ${error.error}`); 
    });
  }

  setPlanedTimeMessage()
  {
    this.timeErrorMessage = "";
    this.timeWarningMessage = "";
    this.disabledUpload = false;
    if (this.viewModel.estimateManHour > 0)
    {
      var time = this.viewModel.estimateManHour - this.planTimeModel.actualTaskTime;
      if (this.planTimeModel.actualTaskTime == 0)
      {
         this.timeErrorMessage = "There are not any Timesheet for this Document, Complete Timesheet correctly, and then upload Documents.";
         this.disabledUpload = true;
      }
      else if (time > 0 && (time / this.viewModel.estimateManHour) > 0.5)
      {
          this.timeWarningMessage = "Warning: The diffrent between Planed Time and Actual Time is more than 50%."       
      }
    }
  }
  toExpertPermission()
  {
    return this.hasPosition(Position.PSL) && this.isCurrentDiscipline && (this.viewModel.currentState == PlannedTaskState.WaitPSL || this.viewModel.currentState == PlannedTaskState.InprogressExpert ||
       this.viewModel.currentState == PlannedTaskState.RejectedByPSL || this.viewModel.currentState == PlannedTaskState.RejectedByQA ||this.viewModel.currentState == PlannedTaskState.RejectedByPM || this.viewModel.currentState == PlannedTaskState.RejectedByEM || this.viewModel.currentState == PlannedTaskState.RejectedByDCC )
  }

  idcPermission()
  {
    return (this.hasPosition(Position.PSL) || this.hasPosition(Position.Expert)) && this.isCurrentDiscipline;
  }

  pslApproveAccess()
  {
     return this.hasPosition(Position.PSL) && this.isCurrentDiscipline && (this.viewModel.currentState == PlannedTaskState.WaitPSL || this.viewModel.currentState == PlannedTaskState.InprogressExpert ||
      this.viewModel.currentState == PlannedTaskState.RejectedByPSL || this.viewModel.currentState == PlannedTaskState.RejectedByQA ||this.viewModel.currentState == PlannedTaskState.RejectedByPM || this.viewModel.currentState == PlannedTaskState.RejectedByEM || this.viewModel.currentState == PlannedTaskState.RejectedByDCC )
  }

  pslReturnAccess()
  {
     return this.hasPosition(Position.PSL) && this.isCurrentDiscipline && this.viewModel.currentState == PlannedTaskState.WaitingForQA
  }

  expertPermission()
  {
   return this.hasPosition(Position.Expert) && this.isCurrentDiscipline && (this.viewModel.currentState == PlannedTaskState.InprogressExpert ||
      this.viewModel.currentState == PlannedTaskState.RejectedByPSL || this.viewModel.currentState == PlannedTaskState.RejectedByQA || this.viewModel.currentState == PlannedTaskState.RejectedByPM || this.viewModel.currentState == PlannedTaskState.RejectedByEM || this.viewModel.currentState == PlannedTaskState.RejectedByDCC)
  }

  expertReturnAccess()
  {
   return this.hasPosition(Position.Expert) && this.isCurrentDiscipline && (this.viewModel.currentState == PlannedTaskState.WaitPSL) && this.viewModel.approvalStates.length > 1
  }

  pslRejectAccess()
  {
    return (this.hasPosition(Position.PSL) && this.isCurrentDiscipline && (this.viewModel.currentState == PlannedTaskState.WaitPSL) && (this.viewModel.approvalStates.length > 1 ));
  }
  qaAccess()
  {
    return this.hasPosition(Position.QA) && this.viewModel.currentState == PlannedTaskState.WaitingForQA
  }
  qaReturnAccess()
  {
    return this.hasPosition(Position.QA) && (this.viewModel.currentState == PlannedTaskState.WaitingForPMApproval ||  this.viewModel.currentState == PlannedTaskState.RejectedByQA)
  }
  pmAccess()
  {
    return this.hasPosition(Position.ProjectManager) && this.viewModel.currentState == PlannedTaskState.WaitingForPMApproval
  }
  pmReturnAccess()
  {
    return this.hasPosition(Position.ProjectManager) && (this.viewModel.currentState == PlannedTaskState.WaitingForEMApproval ||  this.viewModel.currentState == PlannedTaskState.RejectedByPM)
  }
  emAccess()
  {
    return this.hasPosition(Position.EngineeringManager) && this.viewModel.currentState == PlannedTaskState.WaitingForEMApproval
  }
  emReturnAccess()
  {
    return this.hasPosition(Position.EngineeringManager) && (this.viewModel.currentState == PlannedTaskState.WaitDCC ||  this.viewModel.currentState == PlannedTaskState.RejectedByEM)
  }
  dccAccess()
  {
    return this.hasPosition(Position.DCC) && this.viewModel.currentState == PlannedTaskState.WaitDCC 
  }
  dccReturnAccess()
  {
    return this.hasPosition(Position.DCC) && (this.viewModel.currentState == PlannedTaskState.Completed ||  this.viewModel.currentState == PlannedTaskState.RejectedByDCC)
  }
  
}
