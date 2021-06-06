import { Component, OnInit } from '@angular/core';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State,process } from '@progress/kendo-data-query';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { OrganizationPosition } from '../../models/organization-position';
import { OrganizationPositionService } from '../../services/organization-position.service';
import { Position } from '../../models/position';
import { AssignOrganizationPositionComponent } from './assign-organization-position/assign-organization-position.component';

@Component({
  selector: 'app-organization-position',
  templateUrl: './organization-position.component.html',
  styleUrls: ['./organization-position.component.css']
})
export class OrganizationPositionComponent implements OnInit {

  isLoading : boolean;
  viewModel : any;
  public gridView: GridDataResult;
  public selectionRows: any[] = [];
  orgPositions: OrganizationPosition[];
  positions: Position[];
  public state: State = { };
  public expandedKeys: any; //= [1]; 
  allOrgPositions: OrganizationPosition[];
  public gridViewUser: GridDataResult;
  public stateUser: State = {
    skip: 0,
    take: 10
   };
  constructor(private dialog: MatDialog,private positionService : OrganizationPositionService) {
    this.viewModel = {};
    this.orgPositions = [];
    this.positions = [];
  }

  public ngOnInit(): void {
    this.getOrganizationChart();
}

  private setGrid(): void {      
       this.gridView = process(this.orgPositions,this.state);
  }

  getOrganizationChart(): void {
    this.isLoading = true;
    this.positionService.getOrganizationChart().subscribe( (result : any) =>  {
          this.isLoading = false;
          this.positions = result.data;
          this.expandedKeys = this.positions.filter((x: any) => x.parentId == null).map((item: any) =>  { return  item.title});
      }, error => {    
        this.isLoading = false;
    });     
  }

  getOrgPositions()
  {
    if (isNullOrUndefined(this.viewModel.discipline))
        {
          this.orgPositions = [];
          this.selectionRows = [];
          this.setGrid();
          return;
        }
    this.isLoading = true;    
    this.positionService.getList("OrganizationPositionUsers",`${this.viewModel.discipline.id}`).subscribe( (result : any) =>  {
          this.isLoading = false;
          this.orgPositions = result.data;
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

handlePositionSelection(e)
{
  this.viewModel.discipline = e.dataItem;
  this.getOrgPositions();
}

public assignRole()
{
  if (isNullOrUndefined(this.viewModel.discipline) )
  {
    alert("Please select Organization Role");
    return;
  }
  var row = {
    discipline : this.viewModel.discipline,
  }
  this.openDetail(row);
}

public openDetail(row : any)
  {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "700px";
    dialogConfig.height = "380px";
    dialogConfig.data = row;

    const dialogRef = this.dialog.open(AssignOrganizationPositionComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {     
        if (result !== null)
         this.getOrgPositions();
      });      
   }
public edit()
{
    if (this.selectionRows.length > 0)
    {
       var item = this.orgPositions.find((row: any) => { return row.id ==  this.selectionRows[0];})
       this.openDetail(item);
    }
}
   
   delete()
   {
     if (this.selectionRows.length > 0)
     { 
       var item = this.orgPositions.find((row: any) => { return row.id ==  this.selectionRows[0];})
       if(confirm(`Are you sure to delete Position  "${item.user.title}"`)) {
        this.isLoading = true;
         this.positionService.Delete(item).subscribe( result => {
            this.getOrgPositions();
          }, error => {
     
            this.isLoading = false;;
            alert(`Position "${item.user.title}" is used. Could not be deleted.`);
        });
      }
     }
   }

   private setUserGrid(): void {      
    this.gridViewUser = process(this.allOrgPositions,this.stateUser);
  }

  public dataStateUserChange(state: DataStateChangeEvent): void {
    this.stateUser = state;
    this.setUserGrid();
}
getAllOrgPositions()
{
  this.isLoading = true;    
  this.positionService.getList("AllOrganizationPositionUsers").subscribe( (result : any) =>  {
        this.isLoading = false;
        this.allOrgPositions = result.data;
        this.setUserGrid();
    }, error => {    
      this.isLoading = false;
  });     
}
 
}
