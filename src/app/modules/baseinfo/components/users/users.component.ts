import { Component, OnInit } from '@angular/core';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State,process } from '@progress/kendo-data-query';
import { SecurityUser } from '../../models/security-user';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SecurityUserService } from '../../services/security-user.service';
import { UserDetailComponent } from './user-detail/user-detail.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  
  isLoading : boolean;
  public gridView: GridDataResult;
  public selectionRows: any[] = [];
  private users: SecurityUser[] 
  public state: State = {
    skip: 0,
    take: 10      
};

  constructor(private dialog: MatDialog,private userService : SecurityUserService) {
    this.users = [];
  }

  public ngOnInit(): void {
    this.getUsers();
}

  private setGrid(): void {      
       this.gridView = process(this.users,this.state);
  }

  getUsers(): void {
    this.isLoading = true;
    this.userService.getList('AllUsers')
    .subscribe( (result : any) =>  {
        this.isLoading = false;
        this.users = result.data;
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
    var item = this.users.find((row: any) => { return row.id ==  this.selectionRows[0];})
    this.openDetail(item);
    }
}

public openDetail(row : any)
  {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "900px";
    dialogConfig.height = "530px";
    dialogConfig.data = row;

    const dialogRef = this.dialog.open(UserDetailComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {     
        if (result !== null)
         this.getUsers();
      });      
   }
   
   delete()
   {
     if (this.selectionRows.length > 0)
     { 
       var item = this.users.find((row: any) => { return row.id ==  this.selectionRows[0];})
       if(confirm(`Are you sure to delete  "${item.lastName}"`)) {
        this.isLoading = true;
         this.userService.Delete(item).subscribe( result => {
            this.isLoading = false;
            this.getUsers();
          }, error => {
     
            this.isLoading = false;;
            alert(`User "${item.lastName}" is used. Could not be deleted.`);
        });
      }
     }
   }
 
}
