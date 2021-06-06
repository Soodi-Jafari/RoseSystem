import { Component, OnInit, OnDestroy } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { AttachFile } from 'src/app/models/attach-file';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';
import { LookupValue } from 'src/app/models/lookup-value';
import { Subject } from 'src/app/home/observer/subject';
import { MrpVendorFlow, VendorOffer } from '../../../models/mrp-vendor-flow';
import { MRP } from '../../../models/mrp';
import { MRPVendorFlowService } from '../../../services/mrp-vendor-flow.service';
import { MRPService } from '../../../services/mrp.service';
import { VendorFlowState } from 'src/app/modules/general/enums/vendor-flow-state.enum';
import { ApprovalFlow } from 'src/app/models/approval-flow';
import { Position } from 'src/app/modules/general/enums/position.enum';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { IdcService } from 'src/app/modules/proqurement/services/idc.service';
import { EntityType } from 'src/app/modules/general/enums/entity-type.enum';
import { Idc } from 'src/app/modules/proqurement/models/idc';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { Role } from 'src/app/models/project';

@Component({
  selector: 'app-mrpvendorflow-detail',
  templateUrl: './mrpvendorflow-detail.component.html',
  styleUrls: ['./mrpvendorflow-detail.component.css']
})
export class MrpvendorflowDetailComponent implements OnInit,OnDestroy {

  isLoading : boolean;
  isEditMode: boolean;
  viewModel : MrpVendorFlow;
  vendorFlow: any;
  mrp: MRP;
  mrpId: any;
  idc: Idc;
  isOwner: boolean;
  expertUsers: Array< LookupValue>
  uploadSaveUrl = ''; // should represent an actual API endpoint
  //currerntPosition : number;
  public gridView: GridDataResult;  
  navigationSubscription;
  correspondenceTypes;
  state: State = {
    skip: 0
};

  constructor(public flowService : MRPVendorFlowService,private globalConfigService : GlobalConfigService,
                  public mrpService : MRPService,private router : Router,public subject: Subject,
                  private route: ActivatedRoute,private idcService: IdcService)
               
 {
  
  this.subject = subject;
  this.subject.attach(this);
 // this.navigationSubscription = this.router.events.subscribe((e: any) => {
    // If it is a NavigationEnd event re-initalise the component
  //  if (e instanceof NavigationEnd) {
      this.initialiseInvites();
   //   }
  //  });
        
   }

   initialiseInvites() {
 // Set default values and re-fetch any data you need.
    this.correspondenceTypes = EnumCoding.correspondenceTypes
    this.route.params.subscribe(params => {
      this.isLoading = true;
      this.isEditMode = false;
      this.isOwner = false;
     //var subject = !isNullOrUndefined(this.viewModel) ? this.viewModel.subject : undefined;
      this.viewModel = new MrpVendorFlow();
      this.mrpId = this.route.snapshot.paramMap.get('mrpId');   
  
      this.viewModel.id = params['id'] == 'null' ? null : params['id'];
      if (isNullOrUndefined(this.viewModel.id) )
      this.viewModel.parentId = params['parentId'] == 'null' ? null : params['parentId'];
      this.viewModel.vendor =  {id : params['venId'], title: params['venTitle'], name :''}; 

    this.getMrp();
     if ( !isNullOrUndefined(this.viewModel.id))
     {
        this.isEditMode = true;
        this.getMrpVendorFlow(this.viewModel.id); 
     }
     else
     {
       this.isLoading = false;
       if (!isNullOrUndefined(this.viewModel.parentId))
       {
           this.viewModel.direction = false;
         //  this.viewModel.subject = subject;   
           this.getMrpVendorFlowParent(this.viewModel.parentId);
       }
       else
       {
         this.viewModel.direction = true;        
       }
        this.viewModel.vendorFlowStatus = 1;
        this.viewModel.vendorAttachs =[];
     }
     if (!isNullOrUndefined(this.viewModel.parentId) && !this.viewModel.direction )
           this.getIDC();
  });
}

  ngOnDestroy() {    
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

   refresh(): void {
    if (!isNullOrUndefined(this.getCurrentDiscipline()))
    {
      this.isOwner = _.some(this.getCurrentDiscipline(), (item : any) => {
             return item.disciplineId == this.mrp.disciplineId
      })
    }
  }

  ngOnInit(){ 
  }

  hasPosition(pos: number)
  { 
    var res =  _.some(this.subject.getState().roles, (role : any) => {
      return  role.positionId == pos;
     });
     return res;
  }
 
  getMrpVendorFlow(id: number)
  {
    this.isLoading = true;
    this.flowService.getSingle('GetSingle', id.toString()).subscribe((result : any) =>
    {
      this.isLoading = false;
      this.viewModel = result.model     
      if (isNullOrUndefined(this.viewModel.vendorAttachs))
           this.viewModel.vendorAttachs = [];
    }, error => {    
      this.isLoading = false;
    });    
  }

   
  getMrpVendorFlowParent(id: number)
  {
    this.isLoading = true;
    this.flowService.getSingle('GetSingle', id.toString()).subscribe((result : any) =>
    {
      this.isLoading = false;
      this.viewModel.subject = result.model.subject;
      this.viewModel.vendorOffer = new VendorOffer();
      this.viewModel.vendorOffer.deadline = result.model.deadline;
      this.viewModel.deadline = result.model.deadline;
      this.viewModel.vendorOffer.fileDirection = result.model.fileDirection;
      this.viewModel.vendorOffer.vendorAttachs = result.model.vendorAttachs;
    }, error => {    
      this.isLoading = false;
    });    
  }

getMrp()
{
  this.mrpService.GetMrp(this.mrpId).subscribe((result : any) => 
  { 
      this.mrp = result.model;
      if (isNullOrUndefined(this.subject.getState()) || this.mrp.projectId != this.subject.getState().id)
          this.subject.projectId = this.mrp.projectId;
      var venTitle = this.viewModel.vendor.title.split('.').join("");
      this.uploadSaveUrl = this.globalConfigService.apiUrl + `/api/files/upload/1/${this.mrp.mrpNo}/1/${venTitle}`; 
     // if (!isNullOrUndefined(this.viewModel.parentId) || ( this.hasPosition(Position.PSL) && !this.viewModel.direction))
          this.getExperts();
      if (!isNullOrUndefined(this.getCurrentDiscipline()))
          {
            this.isOwner = _.some(this.getCurrentDiscipline(), (item : any) => {
                   return item.disciplineId == this.mrp.disciplineId
            })
           /*  if ( this.mrp.disciplineId == this.getCurrentDiscipline().disciplineId)
               this.isOwner = true;
            else
               this.isOwner = false;  */ 
          }   
  });
}
getExperts()
{
  this.flowService.getUserExpertLookup(`${this.mrp.projectId.toString()}/${this.mrp.disciplineId.toString()}`).subscribe((result : any) => 
  {
    this.expertUsers = result.data
  });
}
  
   onAttachFileChanged(attachFiles : AttachFile[])
   {
      this.viewModel.vendorAttachs = attachFiles;
   }

    getFileDirection()
   {
     if (!isNullOrEmptyString(this.viewModel.vendorOffer.fileDirection))
          return  'file:///' + this.viewModel.vendorOffer.fileDirection;
   } 

   getIDC()
   {
      this.idcService.getEntityIdc('EntityIdc', `${this.viewModel.parentId.toString()}/${EntityType.MRPVendorFlow.toString()}`).subscribe((result : any) =>
      {
          this.idc = result.model;
          if (!isNullOrUndefined(result.model))
              this.gridView = process(this.idc.distributions,this.state);
      });   
   }
  save()
  {
    if (isNullOrUndefined(this.viewModel.subject) || isNullOrUndefined(this.viewModel.correspondenceType) 
    || isNullOrUndefined(this.viewModel.direction))
    {
         alert("Please enter required fields!");
          return;
    }
    this.isLoading = true;
    this.viewModel.mrpId = this.mrpId;
    this.flowService.Post(this.viewModel).subscribe( result => {
      this.isLoading = false;
      this.router.navigate([`/home/procurement/vendorOffer`]);
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

    replyVendor()
    {
       this.router.navigate([`/home/procurement/preOrder/vendorflow/detail/${this.mrpId}/${this.viewModel.vendor.id}/${this.viewModel.vendor.title}/null/${this.viewModel.id}`]);     
    }

    saveState(state: ApprovalFlow)
    {
      this.isLoading = true;
      state.entityId = this.viewModel.id;    

      this.flowService.ChangeState(state).subscribe( result => {
        this.isLoading = false;
      //  this.router.navigate([`/home/preOrder/vendorflow/${this.mrpId}`]);
        this.router.navigate([`/home/procurement/vendorOffer`]);
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
      if (isNullOrUndefined(this.viewModel.currentState))
         this.save();
      else
      {
        var state = new ApprovalFlow();
        state.flowState = VendorFlowState.InprogressExpert; 
        state.expertUserId = this.viewModel.toExpert.id;
        state.comment = this.viewModel.comment;
        state.flowAttachs = this.viewModel.vendorAttachs;
        this.saveState(state);
      }
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
      if (isNullOrUndefined(this.viewModel.currentState))
         this.save();
      else
      {
        var state = new ApprovalFlow();
        state.flowState = VendorFlowState.WaitingForPMApproval; 
        var lastState = _.last(this.viewModel.vendorFlowStates);
        state.flowAttachs = this.viewModel.vendorAttachs.length > 0 ? this.viewModel.vendorAttachs :
        !isNullOrUndefined(lastState) && lastState.flowState == VendorFlowState.WaitingForPSLApproval ? lastState.flowAttachs : [];
        state.comment = !isNullOrEmptyString(this.viewModel.comment) ? this.viewModel.comment : !isNullOrUndefined(lastState) && lastState.flowState == VendorFlowState.WaitingForPSLApproval ? lastState.comment : this.viewModel.comment;   
        this.saveState(state);
      }
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
      state.comment = this.viewModel.comment;
      state.flowAttachs = this.viewModel.vendorAttachs;
      this.saveState(state);
    }
    approvedByEM()
    {
      var state = new ApprovalFlow();
      state.flowState = VendorFlowState.ApprovedByEM; 
      state.flowAttachs = _.last(this.viewModel.vendorFlowStates).flowAttachs;
      state.comment = !isNullOrEmptyString(this.viewModel.comment) ?  this.viewModel.comment : _.last(this.viewModel.vendorFlowStates).comment;
      this.saveState(state);
    }

    rejectedByEM()
    {
      var state = new ApprovalFlow();
      state.flowState = VendorFlowState.RejectedByEM;
      state.comment = this.viewModel.comment; 
      state.flowAttachs = this.viewModel.vendorAttachs;
      this.saveState(state);
    }
   
    postedToVendor()
    {
      var state = new ApprovalFlow();
      state.flowState = VendorFlowState.PostedToVendor; 
      state.flowAttachs = _.last(this.viewModel.vendorFlowStates).flowAttachs;
      state.comment = _.last(this.viewModel.vendorFlowStates).comment;
      this.save();
      this.saveState(state);
    }

    toIdc()
    {
      if (isNullOrUndefined(this.idc))
        this.router.navigate([`/home/procurement/idc/null/${this.viewModel.parentId}/${EntityType.MRPVendorFlow}`]);
      else
        this.router.navigate([`/home/procurement/idc/${this.idc.id}/${this.viewModel.parentId}/${EntityType.MRPVendorFlow}`]);
    }
    getStatusTitle(id)
    {
      if (!isNullOrUndefined(id))
        return EnumCoding.IDCResponseStatus.find((t : any) => t.id == id).title;
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

  toExpertAccess()
  {
    return this.hasPosition(Position.PSL) && !this.viewModel.direction && this.isOwner &&
     (this.viewModel.id == null || this.viewModel.currentState == VendorFlowState.InprogressExpert || this.viewModel.currentState == VendorFlowState.RejectedByPSL || this.viewModel.currentState == VendorFlowState.WaitingForPSLApproval || this.viewModel.currentState == VendorFlowState.RejectedByPM || this.viewModel.currentState == VendorFlowState.RejectedByEM)
  }
   
  idcAccess()
  {
    return (this.hasPosition(Position.PSL) || this.hasPosition(Position.Expert)) && !this.viewModel.direction && this.isOwner && (this.viewModel.id == null || this.viewModel.currentState == VendorFlowState.InprogressExpert || this.viewModel.currentState == VendorFlowState.WaitingForPSLApproval || this.viewModel.currentState == VendorFlowState.RejectedByPM || this.viewModel.currentState == VendorFlowState.RejectedByEM)
  }

  coordToPslAccess()
  {
    return this.hasPosition(Position.ProcurementCoordinator) && this.viewModel.id == null;
  }

  pslRejectAccess()
  {
    return this.hasPosition(Position.PSL) && this.isOwner && this.viewModel.currentState == VendorFlowState.WaitingForPSLApproval;
  }
  toPMAccess()
  {
    return this.hasPosition(Position.PSL) && this.isOwner && (this.viewModel.id == null || this.viewModel.currentState == VendorFlowState.InprogressExpert || this.viewModel.currentState == VendorFlowState.RejectedByPSL || this.viewModel.currentState == VendorFlowState.WaitingForPSLApproval || this.viewModel.currentState == VendorFlowState.RejectedByPM || this.viewModel.currentState == VendorFlowState.RejectedByEM) && !this.viewModel.direction;
  }
  expertToPslAccess()
  {
    return this.hasPosition(Position.Expert) && (this.viewModel.currentState == VendorFlowState.InprogressExpert || this.viewModel.currentState == VendorFlowState.RejectedByPSL);
  }
  pmAccess()
  {
    return this.hasPosition(Position.ProjectManager) && this.viewModel.currentState == VendorFlowState.WaitingForPMApproval;
  }
  emAcceess()
  {
    return this.hasPosition(Position.EngineeringManager) && this.viewModel.currentState == VendorFlowState.WaitingForEMApproval;
  }
  toVendorAccess()
  {
    return this.hasPosition(Position.ProcurementCoordinator) && this.viewModel.currentState == VendorFlowState.ApprovedByEM;
  }
}



