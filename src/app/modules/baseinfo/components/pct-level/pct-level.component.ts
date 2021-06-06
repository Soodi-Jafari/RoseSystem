import { Component, OnInit, ViewChild } from '@angular/core';
import { GridDataResult, GridComponent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor, State,process } from '@progress/kendo-data-query';
import { PCTLevel } from '../../models/pct-level';
import { PCTService } from '../../services/pct.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-pct-level',
  templateUrl: './pct-level.component.html',
  styleUrls: ['./pct-level.component.css']
})
export class PctLevelComponent implements OnInit {
  isLoading : boolean;
  gridView: GridDataResult;
  @ViewChild("grid") private grid: GridComponent;
  groups: GroupDescriptor[] = [{
    field: 'project.title'
  },
  {
    field: 'customer.title'
  },
  {
    field: 'documentClass'
  }
];
  pctLevels: PCTLevel[] 
  public selectionRows: any[] = [];
  
  state: State = {
   group: this.groups
};

  constructor(public pctService : PCTService,private router: Router,private route: ActivatedRoute) {
    this.pctLevels = [];
   }

  ngOnInit() {
    this.getPCTs();
  }
  
  getPCTs() : void {    
        this.isLoading = true;
        this.pctService.getList('AllPCTs')
        .subscribe( (result : any) =>  {
           this.isLoading = false;    
           this.pctLevels = result.data;
           this.setGrid();
           this.CollapseOfferGridData(); 
         }, error => {    
          this.isLoading = false;
      });       
  }
    
  private setGrid(): void {      
    this.gridView = process(this.pctLevels,this.state);   
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.setGrid();
  }

    CollapseOfferGridData()
    {
      var grp = _.groupBy(this.pctLevels,(item: any) => item.project.title);
      var idx = 0;
      _.forEach(grp, g => {
        this.grid.collapseGroup(idx.toString());     
    /*     var grp2 = _.groupBy(g,(item: any) => item.customer.title);
        var idx2 = 0;
        _.forEach(grp2, g => {
          this.grid.collapseGroup(`${idx.toString()}_${idx2.toString()}`);         
             var grp3 = _.groupBy(g,(item: any) => item.documentClass);
             var idx3 = 0;
             _.forEach(grp3, g => {
               this.grid.collapseGroup(`${idx.toString()}_${idx2.toString()}_${idx3.toString()}`);
               idx3++;      
              });
          idx2++;      
        }); */
        idx++;
      });
    }

    
public new()
{
  this.router.navigate([`/home/baseinfo/pctDetail/null`]); 
}


public edit()
{
    if (this.selectionRows.length > 0)
    {
      var item = this.pctLevels.find((row: any) => { return row.id ==  this.selectionRows[0];})
      this.router.navigate([`/home/baseinfo/pctDetail/${item.id}`]); 
    }
    else
    {
      alert("Please select Contract!");
    }
}

delete()
{
  if (this.selectionRows.length > 0)
  { 
    var item = this.pctLevels.find((row: any) => { return row.id ==  this.selectionRows[0];})
    if(confirm(`Are you sure to delete this PCT Condition `)) {
     this.isLoading = true;
      this.pctService.Delete(item).subscribe( result => {
         this.getPCTs();
       }, error => {
  
         this.isLoading = false;;
         alert(`This PCT Condition  is used. Could not be deleted.`);
     });
   }

  }
 }
}

