import { Component, Input, OnInit } from '@angular/core';
import { GridDataResult, DataStateChangeEvent} from '@progress/kendo-angular-grid';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { State,process } from '@progress/kendo-data-query';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { IdcService } from '../../services/idc.service';

@Component({
    selector: 'idc-disciplines',
    template: `
    <kendo-grid
    [data]="gridView">

  <kendo-grid-column headerClass="grid-header" field="discipline.title" title="Discipline" editable='false'></kendo-grid-column>
  <kendo-grid-column headerClass="grid-header" field="responseStatus" title="Response Status">
    <ng-template kendoGridCellTemplate let-dataItem>
      {{getStatusTitle(dataItem.responseStatus)}} 
    </ng-template>         
  </kendo-grid-column>
  <kendo-grid-column headerClass="grid-header" field="dueDate" title="Due Date">
    <ng-template kendoGridCellTemplate let-dataItem>
      {{dataItem.dueDate | date}}
    </ng-template>             
  </kendo-grid-column>          
  <kendo-grid-column headerClass="grid-header"field="comment"  title="Remark"></kendo-grid-column>
  <kendo-grid-column headerClass="grid-header"field="fileName" title="Attached File">
      <ng-template kendoGridCellTemplate let-dataItem>       
          <a [href]="getPath(dataItem.filePath)" target="_blank" title="Download">{{dataItem.fileName}}</a>                 
       </ng-template> 
  </kendo-grid-column>
  <kendo-grid-column  headerClass="grid-header"field="replyComment" title="Comment"></kendo-grid-column>
  <kendo-grid-column  headerClass="grid-header"field="lastModifiedDate" title="Comment Date">
      <ng-template kendoGridCellTemplate let-dataItem>
          {{dataItem.lastModifiedDate | date}}
      </ng-template>
  </kendo-grid-column>
  <kendo-grid-column  headerClass="grid-header" field="modifiedUser" title="Comment By User"></kendo-grid-column>
</kendo-grid>
  `
})
export class IdcDisciplinesComponent implements OnInit {

    /**
     * The category for which details are displayed
     */
    @Input() public idcId: number;

    private disciplines: [];
    public gridView: GridDataResult;
    public state: State = {
      skip: 0        
    };

    constructor(private globalConfigService : GlobalConfigService,private idcService : IdcService) { }

    public ngOnInit(): void {
      this.getIdcDistribution();
    }

    private setGrid(): void {  
      this.gridView = process(this.disciplines,this.state);
     }

     public dataStateChange(state: DataStateChangeEvent): void {
      this.state = state;
      this.setGrid();
       }
  

       getIdcDistribution()
       {
            this.idcService.get('IdcDistributions', `${this.idcId}`).subscribe((result : any) => 
            {
               this.disciplines = result.data   
               this.setGrid();
            });
       }

       getStatusTitle(id)
       {
         if (!isNullOrUndefined(id))
           return EnumCoding.IDCResponseStatus.find((t : any) => t.id == id).title;
       }

       getPath(filepath: string)
       {
         return this.globalConfigService.apiUrl + '/' + filepath;
       }    
}
