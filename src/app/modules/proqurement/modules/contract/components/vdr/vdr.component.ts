import { Component, OnInit } from '@angular/core';
import { VDR } from '../../models/vdr';
import { Idc } from 'src/app/modules/proqurement/models/idc';
import { LookupValue } from 'src/app/models/lookup-value';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State,process } from '@progress/kendo-data-query';
import { VDRService } from '../../services/vdr.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IdcService } from 'src/app/modules/proqurement/services/idc.service';
import { Subject } from 'src/app/home/observer/subject';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';
import { AttachFile } from 'src/app/models/attach-file';
import { EntityType } from 'src/app/modules/general/enums/entity-type.enum';
import { ApprovalFlow } from 'src/app/models/approval-flow';
import { VendorFlowState } from 'src/app/modules/general/enums/vendor-flow-state.enum';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { FileOwner } from 'src/app/modules/general/enums/file-owner';
import { Position } from 'src/app/modules/general/enums/position.enum';
import { Role } from 'src/app/models/project';
import { Observer } from 'src/app/home/observer/observer';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Component({
  selector: 'app-vdr',
  templateUrl: './vdr.component.html',
  styleUrls: ['./vdr.component.css']
})
export class VdrComponent implements OnInit,Observer {

  isLoading : boolean;
  viewModel : VDR;
  idc: Idc;
  isOwner: boolean;
  expertUsers: Array< LookupValue>
  uploadSaveUrl = ''; 
  public gridView: GridDataResult;  
  state: State = {
    skip: 0
  };

  constructor(public vdrService : VDRService,private globalConfigService : GlobalConfigService,public subject: Subject,
              private router : Router,private route: ActivatedRoute,private idcService: IdcService) { 

                this.viewModel = new VDR();
                this.isOwner = false;
                this.subject.attach(this);
                this.viewModel.id = parseInt(this.route.snapshot.paramMap.get('id'))
  }

  ngOnInit() {

     this.getVDR(this.viewModel.id); 
     this.getIDC();
  }

  refresh(): void {
    if (!isNullOrUndefined(this.getCurrentDiscipline()))
    {            
           this.isOwner = _.some(this.getCurrentDiscipline(), (item : any) => {
              return item.disciplineId == this.viewModel.disciplineId
        })
     } 
  }

  hasPosition(pos: number)
  { 
    var res =  _.some(this.subject.getState().roles, (role : any) => {
      return  role.positionId == pos;
     });
     return res;
  }
 
  getVDR(id: number)
  {
    this.isLoading = true;
    this.vdrService.getSingle('GetSingle', id.toString()).subscribe((result : any) =>
    {
      this.isLoading = false;
      this.viewModel = result.model;
      if (isNullOrUndefined(this.subject.getState()) || this.viewModel.projectId != this.subject.getState().id)
           this.subject.projectId = this.viewModel.projectId;

      var venTitle = this.viewModel.vendor.split('.').join("");
      this.uploadSaveUrl = this.globalConfigService.apiUrl + `/api/files/upload/1/${venTitle}/${FileOwner.VendorTransmittalApproval}/${this.viewModel.vpis.title}`;    
      if (isNullOrUndefined(this.viewModel.vendorAttachs))
           this.viewModel.vendorAttachs = [];
      if (!isNullOrUndefined(this.getCurrentDiscipline()))
       {            
              this.isOwner = _.some(this.getCurrentDiscipline(), (item : any) => {
                 return item.disciplineId == this.viewModel.disciplineId
           })
        }     
      this.getExperts();     
    }, error => {    
      this.isLoading = false;
    });      
  }

  getCurrentDiscipline()
  { 
    if (!isNullOrUndefined(this.subject.getState()))
    {
      var role =  _.filter(this.subject.getState().roles, (role : Role) => {
         return  role.positionId == Position.PSL || role.positionId == Position.Expert;
       });
       return role;
    }
    else
       return null;
  }
  
  getExperts()
  {
    this.vdrService.getUserExpertLookup(`${this.viewModel.projectId}/${this.viewModel.disciplineId}`).subscribe((result : any) => 
    {
      this.expertUsers = result.data
    });
  }
    
     onAttachFileChanged(attachFiles : AttachFile[])
     {
        this.viewModel.vendorAttachs = attachFiles;
     }
  
     getIDC()
     {
        this.idcService.getEntityIdc('EntityIdc', `${this.viewModel.id}/${EntityType.VendorTransmittal}`).subscribe((result : any) =>
        {
            this.idc = result.model;
            if (!isNullOrUndefined(result.model))
                this.gridView = process(this.idc.distributions,this.state);
        });   
     }
     
     saveState(state: ApprovalFlow)
     {
       this.isLoading = true;
       state.entityId = this.viewModel.id;
 
       this.vdrService.ChangeState(state).subscribe( result => {
         this.isLoading = false;
         this.router.navigate([`/home/procurement/vendorDocument`]);
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

     toExpert()
     {
       if (isNullOrUndefined(this.viewModel.toExpert))
       {
            alert("Please Select Expert User!");
             return;
       }
  
       var state = new ApprovalFlow();
       state.flowState = VendorFlowState.InprogressExpert; 
       state.expertUserId = this.viewModel.toExpert.id;
       state.flowAttachs = this.viewModel.vendorAttachs;
       state.comment = this.viewModel.comment;
       this.saveState(state);
       
     }
 
     rejectByPSL()
     {
         var state = new ApprovalFlow();
         state.flowState = VendorFlowState.RejectedByPSL; 
         state.flowAttachs = this.viewModel.vendorAttachs;
         state.comment = this.viewModel.comment;
         this.saveState(state);
     }
 
     toProjectManager()
     {
         var state = new ApprovalFlow();
         state.flowState = VendorFlowState.WaitingForPMApproval; 
         var lastState = _.last(this.viewModel.vendorFlowStates);
         state.flowAttachs = this.viewModel.vendorAttachs.length > 0 ? this.viewModel.vendorAttachs :
         !isNullOrUndefined(lastState) && lastState.flowState == VendorFlowState.WaitingForPSLApproval ? lastState.flowAttachs : [];
         state.comment = !isNullOrEmptyString(this.viewModel.comment) ? this.viewModel.comment : !isNullOrUndefined(lastState) && lastState.flowState == VendorFlowState.WaitingForPSLApproval ? lastState.comment : this.viewModel.comment;   
         this.saveState(state);       
     }
 
     toPsl()
     {
        var state = new ApprovalFlow();
        state.flowState = VendorFlowState.WaitingForPSLApproval;
        state.flowAttachs = this.viewModel.vendorAttachs;
        state.comment = this.viewModel.comment;
        this.saveState(state);
     }
 
     approvedByPM()
     {
       var state = new ApprovalFlow();
       state.flowState = VendorFlowState.WaitingForEMApproval; 
       state.comment = !isNullOrEmptyString(this.viewModel.comment) ?  this.viewModel.comment : _.last(this.viewModel.vendorFlowStates).comment;
       state.flowAttachs = _.last(this.viewModel.vendorFlowStates).flowAttachs;
       this.saveState(state);
     }
 
     rejectedByPM()
     {
       var state = new ApprovalFlow();
       state.flowState = VendorFlowState.RejectedByPM; 
       state.flowAttachs = this.viewModel.vendorAttachs;
       state.comment = this.viewModel.comment;
       this.saveState(state);
     }
     approvedByEM()
     {
       var state = new ApprovalFlow();
       state.flowState = VendorFlowState.ApprovedByEM; 
       state.comment =  !isNullOrEmptyString(this.viewModel.comment) ?  this.viewModel.comment : _.last(this.viewModel.vendorFlowStates).comment;
       state.flowAttachs = _.last(this.viewModel.vendorFlowStates).flowAttachs;
       this.saveState(state);
     }
 
     rejectedByEM()
     {
       var state = new ApprovalFlow();
       state.flowState = VendorFlowState.RejectedByEM; 
       state.flowAttachs = this.viewModel.vendorAttachs;
       state.comment = this.viewModel.comment;
       this.saveState(state);
     }
    
     postedToVendor()
     {
       var state = new ApprovalFlow();
       state.flowState = VendorFlowState.PostedToVendor; 
       state.comment =_.last(this.viewModel.vendorFlowStates).comment;
       state.flowAttachs = _.last(this.viewModel.vendorFlowStates).flowAttachs;
       this.saveState(state);
     }
 
     toIdc()
     {
       if (isNullOrUndefined(this.idc))
         this.router.navigate([`/home/procurement/idc/null/${this.viewModel.id}/${EntityType.VendorTransmittal}`]);
       else
         this.router.navigate([`/home/procurement/idc/${this.idc.id}/${this.viewModel.id}/${EntityType.VendorTransmittal}`]);
     }
     getStatusTitle(id)
     {
       if (!isNullOrUndefined(id))
         return EnumCoding.IDCResponseStatus.find((t : any) => t.id == id).title;
     }

     toExpertAccess()
     {
       return this.hasPosition(Position.PSL) && this.isOwner &&
       (this.viewModel.currentState == VendorFlowState.InprogressExpert || this.viewModel.currentState == VendorFlowState.RejectedByPSL || this.viewModel.currentState == VendorFlowState.WaitPSL || this.viewModel.currentState == VendorFlowState.WaitingForPSLApproval || this.viewModel.currentState == VendorFlowState.RejectedByPM || this.viewModel.currentState ==  VendorFlowState.RejectedByEM);
     }
     idcAccess()
     {
       return (this.hasPosition(Position.PSL) || this.hasPosition(Position.Expert)) && this.isOwner && (this.viewModel.currentState == VendorFlowState.WaitPSL || this.viewModel.currentState == VendorFlowState.InprogressExpert || this.viewModel.currentState == VendorFlowState.WaitingForPSLApproval || this.viewModel.currentState == VendorFlowState.RejectedByPM || this.viewModel.currentState == VendorFlowState.RejectedByEM);
     }
     pslRejectAccess()
     {
       return this.hasPosition(Position.PSL) && this.viewModel.currentState == VendorFlowState.WaitingForPSLApproval && this.isOwner;
     }
     toPMAccess()
     {
       return this.hasPosition(Position.PSL) && this.isOwner && (this.viewModel.currentState == VendorFlowState.InprogressExpert || this.viewModel.currentState == VendorFlowState.RejectedByPSL || this.viewModel.currentState == VendorFlowState.WaitPSL || this.viewModel.currentState == VendorFlowState.WaitingForPSLApproval || this.viewModel.currentState == VendorFlowState.RejectedByPM || this.viewModel.currentState == VendorFlowState.RejectedByEM);
     }
     toPslAccess()
     {
       return this.hasPosition(Position.Expert) && (this.viewModel.currentState == VendorFlowState.InprogressExpert || this.viewModel.currentState == VendorFlowState.RejectedByPSL);
     }
     pmAccess()
     {
        return this.hasPosition(Position.ProjectManager)  && this.viewModel.currentState == VendorFlowState.WaitingForPMApproval
     }
     emAccess()
     {
       return this.hasPosition(Position.EngineeringManager) && this.viewModel.currentState == VendorFlowState.WaitingForEMApproval;
     }
     toVendorAccess()
     {
       return this.hasPosition(Position.ProcurementCoordinator) && this.viewModel.currentState == VendorFlowState.ApprovedByEM;
     }
}
