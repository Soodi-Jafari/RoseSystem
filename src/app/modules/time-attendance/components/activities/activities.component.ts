import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Activity } from '../../models/activity';
import { ActivityService } from '../../services/activity.service';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { SelectableSettings } from '@progress/kendo-angular-treelist';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  
  isLoading : boolean;
  activities: Activity[];
  public settings: SelectableSettings = {
    mode: 'row',
    multiple: false,
    enabled: true,
    drag: false
};

public selected: any[] = [];
 // public expandedKeys: any; //= [1]; 
 
  constructor(private dialog: MatDialog,private activityService : ActivityService) {
  }

  public ngOnInit(): void {
    this.getActivities();
}
 
getActivities(): void {
    this.isLoading = true;
    this.activityService.getList("GetAll").subscribe( (result : any) =>  {
          this.isLoading = false;
          this.activities = result.data;
          //this.expandedKeys = this.positions.filter((x: any) => x.parentId == null).map((item: any) =>  { return  item.title});
      }, error => {    
        this.isLoading = false;
      });  
  }


public openDetail(row : any)
{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "750px";
    dialogConfig.height = "600px";
    dialogConfig.data = row;

    const dialogRef = this.dialog.open(ActivityDetailComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {     
        if (result !== null)
         this.getActivities();
      });      
}

public new()
{
  this.openDetail(null);
}

public edit()
{
    if (this.selected.length > 0)
    {
       var item = this.activities.find((row: any) => { return row.id ==  this.selected[0].itemKey;})
       this.openDetail(item);
    }
}
   
   delete()
   {
     if (this.selected.length > 0)
     { 
       var item = this.activities.find((row: Activity) => { return row.id ==  this.selected[0].itemKey;})
       if(confirm(`Are you sure to delete Activity  "${item.title}" and his children?`)) {
        this.isLoading = true;
         this.activityService.Delete(item).subscribe( result => {
            this.getActivities();
          }, error => {
     
            this.isLoading = false;;
            alert(`Activity "${item.title}" is used. Could not be deleted.`);
        });
      }
     }
   }
 
}