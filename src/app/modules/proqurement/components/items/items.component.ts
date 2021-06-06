import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material";
import {  GridDataResult,  DataStateChangeEvent, RowArgs } from '@progress/kendo-angular-grid';
import { GroupDescriptor,process, State } from '@progress/kendo-data-query';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { ProcurementItem } from '../../models/procurement-item';
import { ItemService } from '../../services/item.service';


@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  public gridView: GridDataResult;
  public groups: GroupDescriptor[];
  public selectionRows: any[] = [];
  isLoading : boolean;
  private items: ProcurementItem[] 

  public state: State = {
    skip: 0,
    take: 5,
    group: this.groups
      
};

  constructor(private dialog: MatDialog,private itemService : ItemService) {
    this.isLoading = true;
    this.items = [];
  }

  public ngOnInit(): void {
    this.getItems();
}

  private setGrid(): void {      
       this.gridView = process(this.items,this.state);
  }

  getItems(): void {
    this.itemService.getList('GetAll')
    .subscribe( (result : any) =>  {
        this.isLoading = false;
        this.items = result.data;
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
    var item = this.items.find((row: any) => { return row.id ==  this.selectionRows[0];})
    this.openDetail(item);
    }
}

public openDetail(row : any)
  {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.height = "420px";
    dialogConfig.data = row;

    const dialogRef = this.dialog.open(ItemDetailComponent, dialogConfig);
     dialogRef.afterClosed().subscribe(result => {
        if (result !== null)
         this.getItems();

      });       
   }
 
   delete()
   {
     if (this.selectionRows.length > 0)
     { 
      var item = this.items.find((row: any) => { return row.id ==  this.selectionRows[0];})
      if(confirm(`Are you sure to delete  "${item.title}"`)) {
        this.isLoading = true;
         this.itemService.Delete(item).subscribe( result => {
            this.getItems();
          }, error => {
     
            this.isLoading = false;;
            alert(`Item "${item.title}" is used. Could not be deleted.`);
        });
      }
     }
   }
}
