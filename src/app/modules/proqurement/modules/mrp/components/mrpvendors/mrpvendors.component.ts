import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GridDataResult,  DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor,process, State } from '@progress/kendo-data-query';
import { MrpvendorDetailComponent } from './mrpvendor-detail/mrpvendor-detail.component';
import { MrpVendor } from '../../models/mrp-vendor';
import { MRPVendorService } from '../../services/mrp-vendor.service';
import { MRP } from '../../models/mrp';


export interface DialogData {
  mrp: MRP;
}


@Component({
  selector: 'app-mrpvendors',
  templateUrl: './mrpvendors.component.html',
  styleUrls: ['./mrpvendors.component.css']
})
export class MrpvendorsComponent implements OnInit {

  isLoading: boolean;
  public gridView: GridDataResult;
  public selectionRows: any[] = [];

  private mrpVendors: MrpVendor[] 

  public state: State = {
    skip: 0,
    take: 5
      
};

  constructor(public mrpVendorService : MRPVendorService,private dialog: MatDialog, public dialogRef: MatDialogRef<MrpvendorsComponent>,
                   @Inject(MAT_DIALOG_DATA) public data: DialogData) {
                    this.isLoading = true;
                    this.mrpVendors = [];
   }

    
 ngOnInit() {
  this.getMRPVendors();
}

private setGrid(): void {      
  this.gridView = process(this.mrpVendors,this.state);
}

  getMRPVendors() : void {
     this.mrpVendorService.getList('GetMRPVendors', this.data.mrp.id.toString())
     .subscribe( (result : any) =>  {
      this.isLoading = false;
      this.mrpVendors = result.data;
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
    var item = this.mrpVendors.find((row: any) => { return row.id ==  this.selectionRows[0];})
    this.openDetail(item);
    }
}

   public openDetail(row : any)
   {
     const dialogConfig = new MatDialogConfig();
 
     dialogConfig.disableClose = true;
     dialogConfig.autoFocus = false;
     dialogConfig.width = "650px";
     dialogConfig.height = "350px";
     dialogConfig.data =  {mrp : this.data.mrp,mrpVendor: row};
 
 
     const dialogRef = this.dialog.open(MrpvendorDetailComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
         if (result !== null)
          this.getMRPVendors();
 
       });
        
    }
  
    delete()
    {
      if (this.selectionRows.length > 0)
      { 
        var item = this.mrpVendors.find((row: any) => { return row.id ==  this.selectionRows[0];})
        if(confirm(`Are you sure to delete  "${item.vendor.title}"`)) {
         this.isLoading = true;
          this.mrpVendorService.Delete(item).subscribe( result => {
             this.getMRPVendors();
           }, error => {
      
             this.isLoading = false;;
             alert(`Item "${item.vendor.title}" is used. Could not be deleted.`);
         });
       }
 
      }
    }

  closeDialog() {
    this.dialogRef.close();
  }
}



