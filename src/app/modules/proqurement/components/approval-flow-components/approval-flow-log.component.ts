import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { MatStepper } from '@angular/material';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { SystemType } from 'src/app/modules/general/enums/system-type';

@Component({
    selector: 'approval-flow-log',
    template: `

<mat-horizontal-stepper labelPosition="bottom"  [selectedIndex]="approvalStates.length - 1" #stepper>
  <mat-step *ngFor="let state of approvalStates" [stepControl]="state.id">
        <ng-template matStepLabel>
            <span matTooltip="{{getStateTitle(state.flowState)}}">{{getStateTitle(state.flowState)}}</span>
        </ng-template>
        <div class="row" style="padding-top: 15px;">
         <div class="col-md-3"> 
           <span style="font-weight:bold">{{getStateTitle(state.flowState)}} </span>
         </div>
          <div class="col-md-3"> 
             <span style="font-weight:bold">By : </span>  {{state.creationUser}}
           </div>
         <div class="col-md-3" *ngIf="state.expertUser != undefined"> 
           <span style="font-weight:bold"> To : </span> {{state.expertUser}}
         </div> 
         <div class="col-md-3"> 
         <span style="font-weight:bold"> Action Date: </span>  {{state.creationDate | date}}   {{setTime(state.creationDate)}} 
        </div> 
        </div>
        <div class="row" style="padding-top: 10px;">
        <!-- <div class="col-md-12" *ngIf="systemType == 3">
           <div>
               <label class="label">File Path</label>
           </div>
           <div>
             <input type="text" readonly [value] ="state.fileDirection" class="rose-form-control">                           
           </div>
          </div> -->
          <div class="col-md-12" style="padding-top: 10px;">          
           <div>
            <label class="label"> Comment</label>
           </div>
            <div>
              <textarea rows="5" cols="200" type="text" readonly  [value]="state.comment" class="textarea-form-control"></textarea>                
           </div>                 
         </div>  
         <div class="col-md-12" *ngIf="state.flowAttachs">
         <mat-list>
             <h6 mat-subheader> File Attachs</h6>
             <mat-divider style="padding-bottom: 10px;">       
               </mat-divider>           
          </mat-list>  
          <span *ngFor="let file of state.flowAttachs" style="padding-right: 30px;">
             <a style="padding-right: 30px;" matLine [href]="getPath(file.path)" target="_blank" title="Download">{{file.fileName}}</a>
           </span>  
           <p *ngIf="state.flowAttachs.length == 0"> No File Attach! </p>    
       </div> 
      </div>

  </mat-step> 
</mat-horizontal-stepper>
  `
})
export class ApprovalFlowLogComponent implements OnInit {

    /**
     * The category for which details are displayed
     */
    @Input() public approvalStates: [];
    @Input() public systemType: SystemType;
    @ViewChild('stepper') stepper: MatStepper;

    constructor(private globalConfigService : GlobalConfigService) { }

    public ngOnInit(): void {
    }

     getStateTitle(id)
     {
       if (!isNullOrUndefined(id))
       {
         if (this.systemType == SystemType.Procurement)
            return EnumCoding.vendorFlowActions.find((t : any) => t.id == id).title;        
         else if (this.systemType == SystemType.Task)
            return EnumCoding.PlannedTaskStateActions.find((t : any) => t.id == id).title;    
       }
     }
  
   
    getPath(path : any)
    {
      return this.globalConfigService.apiUrl + '/' + path;
    }

    setTime(date : Date)
    {
       var dt = new Date(date);
       var time = dt.toLocaleTimeString();
       return "  " + time
    }
  
}
