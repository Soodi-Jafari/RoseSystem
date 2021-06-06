import { Component, OnInit, ViewChild, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { GridDataResult, GridComponent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor, State ,process} from '@progress/kendo-data-query';
import { VDR } from '../../../modules/contract/models/vdr';
import { isNullOrUndefined } from 'util';
import { Subject } from 'src/app/home/observer/subject';
import { Router, ActivatedRoute } from '@angular/router';
import { VDRService } from '../../../modules/contract/services/vdr.service';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import * as _ from 'lodash';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'app-vdr-cartable',
  templateUrl: './vdr-cartable.component.html',
  styleUrls: ['./vdr-cartable.component.css']
})
export class VdrCartableComponent implements OnInit {

  @Input() public project: Project;
  @Output() vdrChanged = new EventEmitter<number>();

  isLoading : boolean;
  gridView: GridDataResult;
  @ViewChild("grid") private grid: GridComponent;
  public aggregates: any[] = [{field: 'currentState', aggregate: 'count'},{field: 'discipline', aggregate: 'count'}];
  groups: GroupDescriptor[] = [{
    field: 'currentState',
    aggregates: this.aggregates
  },
  {
    field: 'discipline',
    aggregates: this.aggregates
  }];
  vendorFlows: VDR[] 

  state: State = {
   group: this.groups
};

  constructor(public vdrService: VDRService,private router: Router,private route: ActivatedRoute) {
    this.vendorFlows = [];
   }
  
   ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges) {
    this.getVdrs();
 }
  
  getVdrs() : void {    

        this.isLoading = true;
        this.vdrService.getListByPost('VdrCartable',this.project)
        .subscribe( (result : any) =>  {
           this.isLoading = false;
           _.forEach(result.data,(m : any) => {
            m.creationDate = new Date(m.creationDate);
            m.deadline = new Date(m.deadline);
           }); 
           this.vendorFlows = result.data;
           this.setGrid(); 
           this.CollapseOfferGridData();
           this.vdrChanged.emit(this.vendorFlows.length);
         }, error => {    
          this.isLoading = false;
      });         
  }

  private setGrid(): void {      
    this.gridView = process(this.vendorFlows,this.state);  
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    if (state && state.group) {
      state.group.map(group => group.aggregates = this.aggregates);
    }
    this.state = state;
    this.setGrid();
  }

  getStateTitle(id)
  {
    if (!isNullOrUndefined(id))
      return EnumCoding.vendorFlowStates.find((t : any) => t.id == id).title;
  }

 public viewVdr(row: VDR)
 {
    this.router.navigate([`/home/procurement/vdr/${row.id}`]);       
  } 

  CollapseOfferGridData()
  {
    var grp = _.groupBy(this.vendorFlows,(item: any) => item.currentState);
    var idx = 0;
    _.forEach(grp, g => {
      this.grid.collapseGroup(idx.toString());     
      var grp2 = _.groupBy(g,(item: any) => item.discipline);
      var idx2 = 0;
      _.forEach(grp2, g => {
        this.grid.collapseGroup(`${idx.toString()}_${idx2.toString()}`);
        idx2++;      
      });
      idx++;
    });
  }


}
