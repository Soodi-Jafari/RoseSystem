import { Component, OnInit, Inject } from '@angular/core';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { State,process } from '@progress/kendo-data-query';
import { VendorTransmittalDoc } from '../../models/vendor-transmittal-doc';
import { VendorTransmittalDocService } from '../../services/vendor-transmittal-doc.service';
import { TransmittalDialogData } from '../vendor-transmittals/vendor-transmittals.component';
import { VendorTransmitalDocDetailComponent } from './vendor-transmital-doc-detail/vendor-transmital-doc-detail.component';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';

@Component({
  selector: 'app-vendor-transmittal-docs',
  templateUrl: './vendor-transmittal-docs.component.html',
  styleUrls: ['./vendor-transmittal-docs.component.css']
})
export class VendorTransmittalDocsComponent implements OnInit {

  isLoading : boolean;
  public gridView: GridDataResult;
  public selectionRows: any[] = [];
  private documents: VendorTransmittalDoc[] 

  public state: State = {
    skip: 0,
    take: 5      
   };

   constructor(public docService : VendorTransmittalDocService,private dialog: MatDialog, 
                public dialogRef: MatDialogRef<VendorTransmittalDocsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransmittalDialogData) {
     this.documents = [];    
    }

    ngOnInit() {
      this.getAll();
    }
    
    private setGrid(): void {      
      this.gridView = process(this.documents,this.state);
    }
    
    getAll() : void {
        this.isLoading = true;
         this.docService.getList('GetAll', this.data.transmittal.id.toString())
         .subscribe( (result : any) =>  {
          this.isLoading = false;
          this.documents = result.data;
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
        var item = this.documents.find((row: any) => { return row.id ==  this.selectionRows[0];})
        this.openDetail(item);
        }
    }
    
    public openDetail(row : any)
       {
         const dialogConfig = new MatDialogConfig();
     
         dialogConfig.disableClose = true;
         dialogConfig.autoFocus = false;
         dialogConfig.width = "700px";
         dialogConfig.height = "650px";
         dialogConfig.data =  {transmittal : this.data.transmittal,transmittalDocument : row};
     
         const dialogRef = this.dialog.open(VendorTransmitalDocDetailComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(result => {
             if (result !== null)
              this.getAll();     
           });            
        }

        getStateTitle(id)
        {
          if (!isNullOrUndefined(id))
               return EnumCoding.vendorFlowStates.find((t : any) => t.id == id).title;
          else
              return "Cord. Submit"          
        }
    
      closeDialog() {
        this.dialogRef.close();
      }
 }

