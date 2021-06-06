import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MrpitemDetailComponent } from '../mrpitem-detail/mrpitem-detail.component';
import { GridDataResult,  DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { MrpItem } from '../../../models/mrp-item';
import { MRPItemService } from '../../../services/mrp-item.service';
import { MRP } from '../../../models/mrp';

export interface DialogData {
  
  mrp: MRP;
}

@Component({
  selector: 'app-mrp-items-modal',
  templateUrl: './mrp-items-modal.component.html',
  styleUrls: ['./mrp-items-modal.component.css']
})

export class MrpItemsModalComponent implements OnInit {

  isLoading : boolean;
  public gridView: GridDataResult;
  public selectionRows: any[] = [];
  private mrpItems: MrpItem[] 
  public state: State = {
    skip: 0,
    take: 5
      
};

  constructor(public mrpItemService : MRPItemService,private dialog: MatDialog, public dialogRef: MatDialogRef<MrpItemsModalComponent>,
                   @Inject(MAT_DIALOG_DATA) public data: DialogData) {
                    this.isLoading = true;
                    this.mrpItems = [];
   }
    
 ngOnInit() {
  this.getMRPItems();
}

private setGrid(): void {      
  this.gridView = process(this.mrpItems,this.state);
}

  getMRPItems() : void {
     this.mrpItemService.getList('GetMRTItems', this.data.mrp.id.toString())
     .subscribe( (result : any) =>  {
      this.isLoading = false;
      this.mrpItems = result.data;
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
    var item = this.mrpItems.find((row: any) => { return row.id ==  this.selectionRows[0];})
    this.openDetail(item);
    }
}

public openDetail(row : any)
   {
     const dialogConfig = new MatDialogConfig();
 
     dialogConfig.disableClose = true;
     dialogConfig.autoFocus = false;
     dialogConfig.width = "800px";
     dialogConfig.height = "480px";
     dialogConfig.data =  {mrp : this.data.mrp,mrpItem : row};
 
     const dialogRef = this.dialog.open(MrpitemDetailComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
         if (result !== null)
          this.getMRPItems(); 
       });        
    }

  delete()
  {
    if (this.selectionRows.length > 0)
    { 
     var item = this.mrpItems.find((row: any) => { return row.id ==  this.selectionRows[0];})
     if(confirm(`Are you sure to delete  "${item.item.title}"`)) {
       this.isLoading = true;
        this.mrpItemService.Delete(item).subscribe( result => {
           this.getMRPItems();
         }, error => {
    
           this.isLoading = false;
           alert(`Document "${item.item.title}" is used. Could not be deleted.`);
       });
     }

    }
  }  

  closeDialog() {
    this.dialogRef.close();
  }
}


