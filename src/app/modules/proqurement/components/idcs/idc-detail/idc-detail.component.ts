import { Component, OnInit, ViewChild } from '@angular/core';
import { Idc, IdcDistribution } from '../../../models/idc';
import { IdcService } from '../../../services/idc.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { Subject } from 'src/app/home/observer/subject';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditService } from 'src/app/services/edit.service';
import { State,process } from '@progress/kendo-data-query';
import { AttachFile } from 'src/app/models/attach-file';
import { MRPVendorFlowService } from '../../../modules/mrp/services/mrp-vendor-flow.service';
import { EntityType } from 'src/app/modules/general/enums/entity-type.enum';
import * as _ from 'lodash';
import { FileRestrictions, SuccessEvent } from '@progress/kendo-angular-upload';
import { Position } from 'src/app/modules/general/enums/position.enum';
import { Role } from 'src/app/models/project';
import { FileOwner } from 'src/app/modules/general/enums/file-owner';
import { VendorTransmittalDocService } from '../../../modules/contract/services/vendor-transmittal-doc.service';
import { Observer } from 'src/app/home/observer/observer';
import { PlannedTaskService } from 'src/app/modules/task/services/planned-task.service';
import { SystemType } from 'src/app/modules/general/enums/system-type';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Component({
  selector: 'app-idc-detail',
  templateUrl: './idc-detail.component.html',
  styleUrls: ['./idc-detail.component.css']
})
export class IdcDetailComponent implements OnInit,Observer {

  isLoading : boolean;
  isEditMode: boolean;
  isInDisciplinList: boolean;
  isOwner: boolean;
  viewModel : Idc;
  replyViewModel : IdcDistribution;
  uploadSaveUrl = ''; 
  responseStatuses; 
  buttenText = "Reply IDC";
  myRestrictions: FileRestrictions = {
    maxFileSize: 100000000
  };
 
  @ViewChild("grid") private grid: GridComponent;
  selectionRows: any[] = [];
  public gridView: GridDataResult;  
  public gridState: State = {
    skip: 0,
    take: 15
};

  public formGroup: FormGroup;
  userRoles: Role[];
  currentDiscipRole: Role;
  constructor(public idcService : IdcService,private globalConfigService : GlobalConfigService,
              public subject: Subject,private route: ActivatedRoute, private vtdService: VendorTransmittalDocService,
              private taskService: PlannedTaskService,
              private vendorFlowService : MRPVendorFlowService,private router : Router,
              private formBuilder: FormBuilder, public editService: EditService) 
  {
     this.viewModel = new Idc();
     this.isEditMode = false;
     this.isInDisciplinList = false;
     this.isOwner = false;
     this.subject.attach(this);  
     this.responseStatuses = EnumCoding.IDCResponseStatus;
     this.viewModel.entityId = parseInt(this.route.snapshot.paramMap.get('entityId'));
     this.viewModel.entityType = parseInt(this.route.snapshot.paramMap.get('entityType'));
     this.viewModel.id = parseInt(this.route.snapshot.paramMap.get('id'));   
  }

  ngOnInit() {       
     if (!_.isNaN( this.viewModel.id))
     {
         this.isEditMode = true;
         this.replyViewModel = new IdcDistribution();
         this.getIdc();
     }
     else
     {
         this.getEntityInfo();     
     }
  
  }

  refresh(): void {
     if (!this.isEditMode)
        this.getDisciplines();
     if (!isNullOrUndefined(this.viewModel.distributions) && this.isEditMode) 
     {
        this.checkInDisciplineList();
     }
  }

  getEntityInfo()
  {
    switch (this.viewModel.entityType) {
      case EntityType.MRPVendorFlow:
        this.getMrpVendorFlow();
        break; 
      case EntityType.VendorTransmittal:
        this.getVendorDocument();
        break;   
     case EntityType.Task:
        this.getTask();
        break;         
      default:
        break;
    }
  }

  getMrpVendorFlow()
  {
    this.isLoading = true;
    this.vendorFlowService.getSingle('GetSingle', this.viewModel.entityId.toString()).subscribe((result : any) => 
    {
       this.isLoading = false;
       this.viewModel.desciplineName = result.model.discipline;
       this.viewModel.vendor = result.model.vendor.title;
       this.viewModel.documentNo = result.model.mrpNo;
       this.viewModel.dueDate = result.model.deadline;
       var venTitle = result.model.vendor.title.split('.').join("");
       this.uploadSaveUrl = this.globalConfigService.apiUrl + `/api/files/upload/1/${result.model.mrpNo}/${FileOwner.IDC}/${venTitle}`; 
       if (!this.isEditMode)
       {
          this.viewModel.projectId = result.model.projectId;
          this.viewModel.desciplineId = result.model.disciplineId;
          this.viewModel.fileDirection = result.model.fileDirection;
          this.viewModel.fileAttachs = result.model.vendorAttachs;
          if (isNullOrUndefined(this.subject.getState()) || this.viewModel.projectId != this.subject.getState().id)
               this.subject.projectId = this.viewModel.projectId;
          this.getDisciplines()

       }      
    }, error => {    
      this.isLoading = false;
  });         
  }
  
  getVendorDocument()
  {
    this.isLoading = true;
    this.vtdService.getSingle('GetSingle', `${this.viewModel.entityId}`).subscribe((result : any) => 
    {
       this.isLoading = false;
       this.viewModel.desciplineName = result.model.discipline;
       this.viewModel.vendor = result.model.vendor;
       this.viewModel.documentNo = result.model.vpis.title;
       this.viewModel.dueDate = result.model.deadline;
       var venTitle =  result.model.vendor.split('.').join("");
       this.uploadSaveUrl = this.globalConfigService.apiUrl + `/api/files/upload/1/${result.model.vpis.title}/${FileOwner.IDC}/${venTitle}`; 
       if (!this.isEditMode)
       {
          this.viewModel.projectId = result.model.projectId;
          this.viewModel.desciplineId = result.model.disciplineId;
          this.viewModel.fileDirection = result.model.fileDirection;
          this.viewModel.fileAttachs = result.model.fileAttachs;
          if (isNullOrUndefined(this.subject.getState()) || this.viewModel.projectId != this.subject.getState().id)
               this.subject.projectId = this.viewModel.projectId;
          this.getDisciplines()

       }      
    }, error => {    
      this.isLoading = false;
  });          
  }
    
  getTask()
  {
    this.isLoading = true;
    this.taskService.getSingle('GetSingle', this.viewModel.entityId.toString()).subscribe((result : any) => 
    {
       this.isLoading = false;
       this.viewModel.desciplineName = result.model.disciplineName;
       this.viewModel.documentTitle = result.model.documentTitle;
       this.viewModel.documentNo = result.model.documentNo;
       this.viewModel.dueDate = result.model.dueDate;
       var rev = !isNullOrEmptyString(result.model.revision) ?result.model.revision :"Rev"
       this.uploadSaveUrl = this.globalConfigService.apiUrl + `/api/files/upload/${SystemType.Task}/${result.model.documentNo}/${FileOwner.IDC}/${rev}`; 
       if (!this.isEditMode)
       {
          this.viewModel.projectId = result.model.projectId;
          this.viewModel.desciplineId = result.model.disciplineId;
          this.viewModel.fileDirection = result.model.fileDirection;
          this.viewModel.fileAttachs = result.model.fileAttachs;
          if (isNullOrUndefined(this.subject.getState()) || this.viewModel.projectId != this.subject.getState().id)
               this.subject.projectId = this.viewModel.projectId;
          this.getDisciplines()

       }      
    }, error => {    
      this.isLoading = false;
  });     
  }
  public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
    if (!isEdited) {
        sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    }
}

public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;
    if (!formGroup.valid) {
         // prevent closing the edited cell if there are invalid values.
        args.preventDefault();
    } else if (formGroup.dirty) {
        this.editService.assignValues(dataItem, formGroup.value);
        this.editService.update(dataItem);
    }
}

public createFormGroup(dataItem: any): FormGroup {
  return this.formBuilder.group({
      'discipline': dataItem.discipline,
      'responseStatus': dataItem.responseStatus,
      'dueDate': dataItem.dueDate,
      'comment': dataItem.comment
  });
}

getIdc()
{
     this.isLoading = true;
     this.idcService.getSingle('GetSingle', this.viewModel.id.toString()).subscribe((result : any) => 
     {
        this.isLoading = false;
        this.viewModel = result.model   
        if (isNullOrUndefined(this.subject.getState()) || this.viewModel.projectId != this.subject.getState().id)
              this.subject.projectId = this.viewModel.projectId;

        this.gridView = process(this.viewModel.distributions,this.gridState);
        this.getEntityInfo();
        this.checkInDisciplineList();
     
     }, error => {    
      this.isLoading = false;
  });     
}

checkInDisciplineList()
{
  this.userRoles = this.getCurrentDisciplines();
  this.currentDiscipRole = this.userRoles.length > 0 ? this.userRoles[0] : null;
  this.setDisciplineInit(this.currentDiscipRole);
}

setDisciplineInit(role : Role)
{
  if (!isNullOrUndefined(role))
  {
    if (!isNullOrUndefined(this.viewModel.desciplineId) &&
     this.viewModel.desciplineId == role.disciplineId)
       this.isOwner = true;
    else
       this.isOwner = false;    

    var dis =  _.find(this.viewModel.distributions, (item:any) => item.discipline.id == role.disciplineId);
    if (!isNullOrUndefined(dis))
    {
        this.isInDisciplinList = true;
        this.replyViewModel = dis;
        this.replyViewModel.id = dis.id;
        if (dis.responseStatus == 2)
          this.buttenText = "Document Seen";
        else
          this.buttenText = "Reply IDC";
    }
    else
      this.isInDisciplinList = false;
  }
}


getDisciplines()
{
    if (!isNullOrUndefined(this.subject.getState()))
    {
      this.idcService.get('IdcDisciplines',this.viewModel.projectId).subscribe((data : any) => 
      {
          var indx = 0;
          data.data.forEach((it : any) => {
          var dis =  _.find(this.getPslExpertRoles(), (item:Role) => item.disciplineId == it.disciplineId);
           if (isNullOrUndefined(dis))
            {
               var disc = new IdcDistribution();
               disc.id = it.id;
               disc.discipline = it;
               this.viewModel.distributions.push(disc);
               indx = indx + 1;
            }
          });
          this.gridView = process(this.viewModel.distributions,this.gridState);
      });
    }
  }

/*   getCurrentDiscipline()
  { 
    var role =  _.find(this.subject.getState().roles, (role : Role) => {
      return  role.positionId == Position.PSL || role.positionId == Position.Expert;
     });
     return role;
  } */

  public disSelectionChange(value: Role): void {
    this.replyViewModel = undefined;
    if (!isNullOrUndefined(value))
    {
      this.currentDiscipRole = value;
      this.setDisciplineInit(this.currentDiscipRole);
    }
    else
       this.currentDiscipRole = null;
  }

  getPslExpertRoles()
  {
    var roles =  _.filter(this.subject.getState().roles, (role : Role) => {
      return  role.positionId == Position.PSL || role.positionId == Position.Expert;
     });
     return roles;
  }

  getCurrentDisciplines()
  { 
    var roles = [];
    if (!isNullOrUndefined(this.subject.getState()))
    {
       roles =  _.filter(this.subject.getState().roles, (role : Role) => {
         return  role.positionId == Position.PSL || role.positionId == Position.Expert;
        });     
    }
    return roles;  
  }
  getStatusTitle(id)
  {
    if (!isNullOrUndefined(id))
      return EnumCoding.IDCResponseStatus.find((t : any) => t.id == id).title;
  }

  onAttachFileChanged(attachFiles : AttachFile[])
  {
     this.viewModel.fileAttachs = attachFiles;
  }

  successEventHandler(e: SuccessEvent) {
    this.replyViewModel.fileName = e.files[0].name;
    this.replyViewModel.filePath = e.response.body.url;
  } 
    getPath(filePath: string)
    {
      return this.globalConfigService.apiUrl + '/' + filePath;
    }

    deleteFile()
    {     
       if(confirm(`Are you sure to delete  "${this.replyViewModel.fileName}"`)) {
  
        this.replyViewModel.fileName = undefined;
        this.replyViewModel.filePath = undefined;
      
        }
    }

  sendToPSL()
  {
    debugger;
    this.grid.closeCell();
    if ( (isNullOrUndefined(this.viewModel.fileDirection) && this.viewModel.fileAttachs.length == 0))
    {
         alert("Please, Attach File or inter file direction!");
          return;
    }

    if (this.selectionRows.length == 0)
    {
         alert("Please, Select at least one discipline");
          return;
    }
    this.viewModel.distributions = _.filter(this.viewModel.distributions, (item : any) => 
    {
       return this.selectionRows.includes(item.id);
    });

   var notSelectStatus = _.some(this.viewModel.distributions, (item : any) =>  isNullOrUndefined(item.responseStatus));
   if (notSelectStatus)
   {
     alert("Please, Select ResponseStatus!");
     return;
    }

    this.isLoading = true;
    this.idcService.Post(this.viewModel).subscribe( result => {
      this.isLoading = false;
      this.navigatePage();
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

  replyComment()
  {
    if (this.replyViewModel.responseStatus != 2 && (isNullOrUndefined(this.replyViewModel.filePath) && isNullOrUndefined(this.replyViewModel.replyComment)))
    {
         alert("Please, Attach File or Comment!");
          return;
    }

    this.isLoading = true;

    this.idcService.ReplyIdc(this.replyViewModel).subscribe( result => {
      this.isLoading = false;
      this.navigatePage();
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

  navigatePage()
  {
    if (this.viewModel.entityType == EntityType.Task)
       this.router.navigate([`/home/task/plannedTaskIdcs`]);
    else
       this.router.navigate([`/home/procurement/vendorIdc`]);
  }

autoIDC()
{
      this.idcService.get('AutoIdc',this.viewModel.documentNo).subscribe((data : any) => 
      {
          data.data.forEach((it : any) => {
            var item = this.viewModel.distributions.find((dis : any) => {return dis.discipline.id == it.discipline.id});
            if (!isNullOrUndefined(item))
            {
             item.responseStatus = it.responseStatus;
             item.dueDate = this.viewModel.dueDate;
             this.selectionRows.push(item.id);
            }
        });
      });
}

completeIdc()
{
  if(confirm(`Are you sure to Complete IDC?`)) {
       this.isLoading = true;
       this.idcService.CompleteIdc(this.viewModel).subscribe((data : any) => 
       {
          this.isLoading = false;
          this.navigatePage();       
       }, error => {
        this.isLoading = false;      
      });
   }
}

}
