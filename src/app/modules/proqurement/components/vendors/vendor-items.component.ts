import { Component, Input, OnInit } from '@angular/core';
import { GridDataResult, DataStateChangeEvent} from '@progress/kendo-angular-grid';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { State,process } from '@progress/kendo-data-query';

@Component({
    selector: 'vendor-items',
    template: `
      <kendo-grid
          [data]="gridView"       
          [pageSize]="state.take"
          [skip]="state.skip"
          [kendoGridSelectBy]="'id'"        
          [pageable]="{
            buttonCount: 5,
            info: true,
            type: 'type',
            pageSizes: true,
            previousNext: true
          }"
          [scrollable]="'none'"
          [navigable]="true"
          kendoGridFocusable
          (dataStateChange)="dataStateChange($event)"
        >
        <kendo-grid-column headerClass="grid-header" [width]="250" field="title" title="Item Title">       
         </kendo-grid-column>
         <kendo-grid-column headerClass="grid-header" field="description" title="Description">       
         </kendo-grid-column>
      </kendo-grid>
  `
})
export class VendorItemsComponent implements OnInit {

    /**
     * The category for which details are displayed
     */
    @Input() public items: [];

    public gridView: GridDataResult;
    public state: State = {
      skip: 0,
      take: 5
        
    };

    constructor(private globalConfigService : GlobalConfigService) { }

    public ngOnInit(): void {
       this.setGrid()
    }

    private setGrid(): void {  
      this.gridView = process(this.items,this.state);
     }

     public dataStateChange(state: DataStateChangeEvent): void {
      this.state = state;
      this.setGrid();
       }
  

}
