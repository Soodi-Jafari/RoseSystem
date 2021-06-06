import { Component, OnInit } from '@angular/core';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { Customer } from '../../models/customer';
import { State, process } from '@progress/kendo-data-query';
import { CustomerService } from '../../services/customer.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  
  isLoading : boolean;
  public gridView: GridDataResult;
  public selectionRows: any[] = [];
  private customers: Customer[] 
  public state: State = {
    skip: 0,
    take: 20      
};

  constructor(private dialog: MatDialog,private customerService : CustomerService) {
    this.customers = [];
  }

  public ngOnInit(): void {
    this.getCustomers();
}

  private setGrid(): void {      
       this.gridView = process(this.customers,this.state);
  }

  getCustomers(): void {
    this.isLoading = true;
    this.customerService.getList('AllCustomers')
    .subscribe( (result : any) =>  {
        this.isLoading = false;
        this.customers = result.data;
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
    var item = this.customers.find((row: any) => { return row.id ==  this.selectionRows[0];})
    this.openDetail(item);
    }
}

public openDetail(row : any)
  {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "700px";
    dialogConfig.height = "400px";
    dialogConfig.data = row;

    const dialogRef = this.dialog.open(CustomerDetailComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {     
        if (result !== null)
         this.getCustomers();
      });      
   }
   
   delete()
   {
     if (this.selectionRows.length > 0)
     { 
       var item = this.customers.find((row: any) => { return row.id ==  this.selectionRows[0];})
       if(confirm(`Are you sure to delete  "${item.customerName}"`)) {
        this.isLoading = true;
         this.customerService.Delete(item).subscribe( result => {
            this.isLoading = false;
            this.getCustomers();
          }, error => {
     
            this.isLoading = false;;
            alert(`User "${item.customerName}" is used. Could not be deleted.`);
        });
      }
     }
   }
 
}
