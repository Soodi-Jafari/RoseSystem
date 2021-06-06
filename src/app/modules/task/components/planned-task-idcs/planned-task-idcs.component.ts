import { Component, OnInit, ViewChild } from '@angular/core';
import { GridDataResult, DataStateChangeEvent, GridComponent } from '@progress/kendo-angular-grid';
import { State, GroupDescriptor,process } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { Subject } from 'src/app/home/observer/subject';
import { Observer } from 'src/app/home/observer/observer';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';
import { IdcService } from 'src/app/modules/proqurement/services/idc.service';
import { Idc } from 'src/app/modules/proqurement/models/idc';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-planned-task-idcs',
  templateUrl: './planned-task-idcs.component.html',
  styleUrls: ['./planned-task-idcs.component.css']
})
export class PlannedTaskIdcsComponent implements OnInit,Observer {
  
  isLoading : boolean;
  currerntPosition : number;
  gridView: GridDataResult;
  @ViewChild("grid") private grid: GridComponent;
  public aggregates: any[] = [{field: 'status', aggregate: 'count'},{field: 'desciplineName', aggregate: 'count'}];
  groups: GroupDescriptor[] = [{
    field: 'status',
    aggregates: this.aggregates
  },
  {
    field: 'desciplineName',
    aggregates: this.aggregates
  }];
  idcs: Idc[];
  currentUser : any;

  state: State = {
   group: this.groups
};

constructor(public idcService : IdcService, private authService : AuthService,
            public subject: Subject,private router: Router) {
      this.idcs = [];
      this.subject = subject;
      this.subject.attach(this);
}

  ngOnInit() {
    this.currentUser = {};
    this.getCurrentUser();
    this.init();
  }

  refresh(): void {  
   this.init();
  }

  init()
  {
    this.getTaskIdcs();
  }

  getCurrentUser()
  {
    this.authService.getLoggedIn().subscribe((result : any) => {
           this.currentUser = result;
           
    });
  }
  getTaskIdcs() : void {    
    if (!isNullOrUndefined(this.subject.getState()))
     {  
        this.isLoading = true;
        this.idcService.getListByPost('TaskIdcs',this.subject.getState())
        .subscribe( (result : any) =>  {
           this.isLoading = false;
           _.forEach(result.data,(m : any) => {
            m.creationDate = new Date(m.creationDate);
           }); 
           this.idcs = result.data;
           this.setGrid(); 
         });
      }       
  }

  private setGrid(): void {      
    this.gridView = process(this.idcs,this.state);
    this.CollapseGridData();
  }

  CollapseGridData()
  {
    var grp = _.groupBy(this.idcs,(item: any) => item.status);
    var idx = 0;
    _.forEach(grp, g => {
      this.grid.collapseGroup(idx.toString());     
      var grp2 = _.groupBy(g,(item: any) => item.desciplineName);
      var idx2 = 0;
      _.forEach(grp2, g => {
        this.grid.collapseGroup(`${idx.toString()}_${idx2.toString()}`);
        idx2++;      
      });
      idx++;
    });
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    if (state && state.group) {
      state.group.map(group => group.aggregates = this.aggregates);
    }
    this.state = state;
    this.setGrid();
  }

  public viewIdc(row: Idc)
  {
     this.router.navigate([`/home/procurement/idc/${row.id}/${row.entityId}/${row.entityType}`]);       
  } 

  delete(row: Idc)
  {
    // var item = this.plannedTasks.find((row: any) => { return row.id ==  this.selectionRows[0];})
     if(confirm(`Are you sure to delete IDC for  "${row.documentNo}"`)) {
       this.isLoading = true;
        this.idcService.Delete(row).subscribe( result => {
           this.getTaskIdcs();
         }, error => {
    
           this.isLoading = false;;
           alert(`IDC "${row.documentNo}" is used. Could not be deleted.`);
       });
     }

  }

  deletePermission(row: Idc)
  {
      return row.creationUserId == this.currentUser.id;
  }

}



