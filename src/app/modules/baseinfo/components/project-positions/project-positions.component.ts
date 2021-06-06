import { Component, OnInit, ViewChild } from '@angular/core';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ProjectPosition } from '../../models/project-position';
import { Position } from '../../models/position';
import { State,process } from '@progress/kendo-data-query';
import { ProjectPositionService } from '../../services/project-position.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { switchMap, delay, map, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import * as _ from 'lodash';
import { isNullOrUndefined } from 'util';
import { Project } from 'src/app/models/project';
import { AddProjectPositionComponent } from './add-project-position/add-project-position.component';

@Component({
  selector: 'app-project-positions',
  templateUrl: './project-positions.component.html',
  styleUrls: ['./project-positions.component.css']
})
export class ProjectPositionsComponent implements OnInit {
  @ViewChild("projectList") projectList;
  isLoading : boolean;
  viewModel : any;
  public gridView: GridDataResult;
  public selectionRows: any[] = [];
  projectPositions: ProjectPosition[];
  positions: Position[];
  projects: Array<Project>;
  sourceProjs: Array<Project>; 
  public state: State = { };
  public expandedKeys: any[]; 
  allProjectPositions: ProjectPosition[];
  public gridViewUser: GridDataResult;
  public stateUser: State = {
    skip: 0,
    take: 10
   };
  constructor(private dialog: MatDialog,private positionService : ProjectPositionService) {
    this.viewModel = {};
    this.projectPositions = [];
    this.allProjectPositions = [];
    this.positions = [];
  }

  public ngOnInit(): void {
    this.getPositions();
    this.getAllProject();
    //this.getAllProjectPositions();
}

ngAfterViewInit() {   
  const contains = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
  this.projectList.filterChange.asObservable().pipe(
        switchMap(value => from([this.sourceProjs]).pipe(
            tap(() => this.projectList.loading = true),
            delay(1000),
            map((projs) => projs.filter(contains(value)))
        ))
    )
    .subscribe(x => {
        this.projects = x;
    });  
}

getAllProject()
{
  this.isLoading = true;
  this.positionService.GetAllProjects().subscribe((result : any) =>  {
    this.isLoading = false;
    this.projects = this.sourceProjs = result.data; //_.orderBy(result.data,['pmProjectId'],['asc']);
    this.viewModel.project = this.projects[0];
   }, error => {    
    this.isLoading = false;
});     
}
  private setGrid(): void {      
       this.gridView = process(this.projectPositions,this.state);
  }

  getPositions(): void {
    this.isLoading = true;
    this.positionService.getPositions().subscribe( (result : any) =>  {
          this.isLoading = false;
          this.positions = result.data;
          this.expandedKeys = this.positions.filter((x: any) => x.hasChild).map((item: any) =>  { return  item.title});
      }, error => {    
        this.isLoading = false;
    });     
  }

  getProjectPositions()
  {
    if (isNullOrUndefined(this.viewModel.position) || isNullOrUndefined(this.viewModel.project) )
        {
          this.projectPositions = [];
          this.selectionRows = [];
          this.setGrid();
          return;
        }
    this.isLoading = true;    
    this.positionService.getList("ProjectPositionUsers",`${this.viewModel.project.id}/${this.viewModel.position.id}`).subscribe( (result : any) =>  {
          this.isLoading = false;
          this.projectPositions = result.data;
          this.selectionRows = [];
          this.setGrid();
      }, error => {    
        this.isLoading = false;
    });     
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.setGrid();
}

projectSelectionChange(value)
{
  this.viewModel.project = value;
  this.getProjectPositions();
}

handlePositionSelection(e)
{
  this.viewModel.position = e.dataItem;
  this.getProjectPositions();
}

public new()
{
  if (isNullOrUndefined(this.viewModel.position) || isNullOrUndefined(this.viewModel.project) )
  {
    alert("Please select Project and Position");
    return;
  }
  var row = {
     position : this.viewModel.position,
     project : { id : this.viewModel.project.id, title : this.viewModel.project.title,name : "" }
  }
  this.openDetail(row);
}

public edit()
{
    if (this.selectionRows.length > 0)
    {
       var item = this.projectPositions.find((row: any) => { return row.id ==  this.selectionRows[0];})
       this.openDetail(item);
    }
}

public openDetail(row : any)
  {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "700px";
    dialogConfig.height = "380px";
    dialogConfig.data = row;

    const dialogRef = this.dialog.open(AddProjectPositionComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {     
        if (result !== null)
         this.getProjectPositions();
      });      
   }
   
   delete()
   {
     if (this.selectionRows.length > 0)
     { 
       var item = this.projectPositions.find((row: any) => { return row.id ==  this.selectionRows[0];})
       if(confirm(`Are you sure to delete Position  "${item.user.title}"`)) {
        this.isLoading = true;
         this.positionService.Delete(item).subscribe( result => {
            this.getProjectPositions();
          }, error => {
     
            this.isLoading = false;;
            alert(`Position "${item.user.title}" is used. Could not be deleted.`);
        });
      }
     }
   }
 
  private setUserGrid(): void {      
    this.gridViewUser = process(this.allProjectPositions,this.stateUser);
  }

  public dataStateUserChange(state: DataStateChangeEvent): void {
    this.stateUser = state;
    this.setUserGrid();
}
getAllProjectPositions()
{
  this.isLoading = true;    
  this.positionService.getList("AllProjectPositionUsers").subscribe( (result : any) =>  {
        this.isLoading = false;
        this.allProjectPositions = result.data;
        this.setUserGrid();
    }, error => {    
      this.isLoading = false;
  });     
}
}
