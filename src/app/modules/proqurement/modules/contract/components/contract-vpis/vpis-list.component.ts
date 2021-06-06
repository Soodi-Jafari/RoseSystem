import { Component, OnInit, Inject } from '@angular/core';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { VPIS } from '../../models/VPIS';
import { State,process } from '@progress/kendo-data-query';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { VPISService } from '../../services/vpis.service';
import { VPISDetailComponent } from './vpis-detail/vpis-detail.component';

@Component({
  selector: 'app-vpis',
  templateUrl: './vpis-list.component.html',
  styleUrls: ['./vpis-list.component.css']
})
export class VPISListComponent implements OnInit {
  
  isLoading : boolean;
  public gridView: GridDataResult;
  public selectionRows: any[] = [];

  private vpis: VPIS[] 

  public state: State = {
    skip: 0,
    take: 5      
   };

   constructor(public vpisService : VPISService,private dialog: MatDialog, public dialogRef: MatDialogRef<VPISListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

     this.vpis = [];
    }

    ngOnInit() {
      this.getAll();
    }
    
    private setGrid(): void {      
      this.gridView = process(this.vpis,this.state);
    }
    
    getAll() : void {
         this.isLoading = true;
         this.vpisService.getList('GetAll', this.data.contract.id.toString())
         .subscribe( (result : any) =>  {
          this.isLoading = false;
          this.vpis = result.data;
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
        var item = this.vpis.find((row: any) => { return row.id ==  this.selectionRows[0];})
        this.openDetail(item);
        }
    }
    
    public openDetail(row : any)
       {
         const dialogConfig = new MatDialogConfig();
     
         dialogConfig.disableClose = true;
         dialogConfig.autoFocus = false;
         dialogConfig.width = "600px";
         dialogConfig.height = "420px";
         dialogConfig.data =  {contract : this.data.contract,vpis : row};
     
     
         const dialogRef = this.dialog.open(VPISDetailComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(result => {
             if (result !== null)
              this.getAll();
     
           });
            
        }
    
    delete()
      {
        if (this.selectionRows.length > 0)
        { 
         var item = this.vpis.find((row: any) => { return row.id ==  this.selectionRows[0];})
         if(confirm(`Are you sure to delete "${item.documentNo}"`)) {
           this.isLoading = true;
            this.vpisService.Delete(item).subscribe( result => {
               this.getAll();
             }, error => {

               this.isLoading = false;
               alert(`Item  "${item.documentNo}" is used. Could not be deleted.`);
           });
         }
    
        }
      }      
    
      closeDialog() {
        this.dialogRef.close();
      }
}
