import { Component, OnInit } from '@angular/core';
import { VendorDetailComponent } from './vendor-detail/vendor-detail.component';
import { MatDialog, MatDialogConfig} from "@angular/material";
import { GridDataResult,  DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GroupDescriptor,process, State } from '@progress/kendo-data-query';
import { VendorService } from '../../services/vendor.service';
import { Vendor } from '../../models/vendor';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {

  isLoading : boolean;
  public gridView: GridDataResult;
  public groups: GroupDescriptor[];
  public selectionRows: any[] = [];
  itemTitle: string;
  private vendors: Vendor[] 
  public excellData: any[] ;
  public state: State = {
    skip: 0,
    take: 5,
    group: this.groups
      
};

  constructor(private dialog: MatDialog,private vendorService : VendorService) {
    this.vendors = [];
    this.isLoading = true;
  }

  public ngOnInit(): void {
    this.getVendors();
}

  private setGrid(): void {      
       this.gridView = process(this.vendors,this.state);
  }

  getVendors(): void {
    this.vendorService.getList('GetAll')
    .subscribe( (result : any) =>  {
        this.isLoading = false;
        this.vendors = result.data;
        this.setGrid();
        this.setExcellData();
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

clearFilter()
{
  this.itemTitle = '';
  this.isLoading = true;
  this.getVendors();
}
public edit()
{
    if (this.selectionRows.length > 0)
    {
    var item = this.vendors.find((row: any) => { return row.id ==  this.selectionRows[0];})
    this.openDetail(item);
    }
}

public openDetail(row : any)
  {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "900px";
    dialogConfig.height = "570px";
    dialogConfig.data = row;

    const dialogRef = this.dialog.open(VendorDetailComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`); 
        if (result !== null)
         this.getVendors();
      });      
   }

   searchItem()
   {
    this.vendorService.getList('VendorItemFilter',this.itemTitle)
    .subscribe( (result : any) =>  {
        this.vendors = result.data;
        this.setGrid();
    });
   }

   setExcellData()
   {
   
     this.excellData = this.vendors;  
   }
   
   delete()
   {
     if (this.selectionRows.length > 0)
     { 
       var item = this.vendors.find((row: any) => { return row.id ==  this.selectionRows[0];})
       if(confirm(`Are you sure to delete  "${item.name}"`)) {
        this.isLoading = true;
         this.vendorService.Delete(item).subscribe( result => {
            this.getVendors();
          }, error => {
     
            this.isLoading = false;;
            alert(`Item "${item.name}" is used. Could not be deleted.`);
        });
      }

     }
   }

 
}
