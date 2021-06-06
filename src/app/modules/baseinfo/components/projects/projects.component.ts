import { Component, OnInit } from '@angular/core';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { Project } from '../../models/project';
import { State,process } from '@progress/kendo-data-query';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ProjectService } from '../../services/project.service';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

    
  isLoading : boolean;
  public gridView: GridDataResult;
  public selectionRows: any[] = [];
  private projects: Project[] 
  public state: State = {
    skip: 0,
    take: 10      
};

  constructor(private dialog: MatDialog,private projectService : ProjectService) {
    this.projects = [];
  }

  public ngOnInit(): void {
    this.getProjects();
}

  private setGrid(): void {      
       this.gridView = process(this.projects,this.state);
  }

  getProjects(): void {
    this.isLoading = true;
    this.projectService.getList('AllProjects')
    .subscribe( (result : any) =>  {
        this.isLoading = false;
        this.projects = result.data;
        this.setGrid();
    }, error => {    
      this.isLoading = false;
  });     
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.setGrid();
}

public new()
{
    this.openDetail(null);
}

public edit()
{
    if (this.selectionRows.length > 0)
    {
    var item = this.projects.find((row: any) => { return row.id ==  this.selectionRows[0];})
    this.openDetail(item);
    }
}

public openDetail(row : any)
  {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "720px";
    dialogConfig.height = "750px";
    dialogConfig.data = row;

    const dialogRef = this.dialog.open(ProjectDetailComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {     
        if (result !== null)
         this.getProjects();
      });      
   }
   
   delete()
   {
     if (this.selectionRows.length > 0)
     { 
       var item = this.projects.find((row: any) => { return row.id ==  this.selectionRows[0];})
       if(confirm(`Are you sure to delete  "${item.projectName}"`)) {
        this.isLoading = true;
         this.projectService.Delete(item).subscribe( result => {
            this.getProjects();
          }, error => {
     
            this.isLoading = false;;
            alert(`Project "${item.projectName}" is used. Could not be deleted.`);
        });
      }
     }
   }
 
}