
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MrpdocumentDetailComponent } from './mrpdocument-detail/mrpdocument-detail.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MrpDocument } from '../../models/mrp-document';
import { MRPDocumentService } from '../../services/mrp-document.service';
import { MRP } from '../../models/mrp';

export interface DialogData {
  
  mrp: MRP;
}

@Component({
  selector: 'app-mrpdocuments',
  templateUrl: './mrpdocuments.component.html',
  styleUrls: ['./mrpdocuments.component.css']
})

export class MrpdocumentsComponent implements OnInit {

  isLoading : boolean;
  displayedColumns: string[] = ['select','document'];  
  mrpDocuments : any;
  selection = new SelectionModel<MrpDocument>(false, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public documentService : MRPDocumentService,private dialog: MatDialog, public dialogRef: MatDialogRef<MrpdocumentsComponent>,
                   @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.isLoading = true;
             
   }

    
 ngOnInit() {
  this.getMRPDocumnets();
}

  getMRPDocumnets() : void {   
     this.documentService.getList('GetMRTDocuments', this.data.mrp.id.toString())
     .subscribe( (result : any) =>  {
        this.isLoading = false;
        this.mrpDocuments = new MatTableDataSource<MrpDocument>(result.data);
        this.mrpDocuments.paginator = this.paginator; 
        this.selection = new SelectionModel<MrpDocument>(false, []);    
     }, error => {    
      this.isLoading = false;
    });  
   }

   public new()
   {
     this.openDetail(null);
   }
 
   
public edit()
{
    if (this.selection.selected.length > 0)
    {
       this.openDetail(this.selection.selected[0]);
    } 
}

   public openDetail(row : any)
   {
     const dialogConfig = new MatDialogConfig();
 
     dialogConfig.disableClose = true;
     dialogConfig.autoFocus = false;
     dialogConfig.width = "680px";
     dialogConfig.height = "530px";
     dialogConfig.data =  {mrp : this.data.mrp,mrpDocument: row};
 
 
     const dialogRef = this.dialog.open(MrpdocumentDetailComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
         if (result !== null)
          this.getMRPDocumnets(); 
       });
        
    }
  
  closeDialog() {
    this.dialogRef.close();
  }

  delete()
  {
    if (this.selection.selected.length > 0)
    { 
     var item = this.selection.selected[0];
     if(confirm(`Are you sure to delete  "${item.document.title}"`)) {
       this.isLoading = true;
        this.documentService.Delete(item).subscribe( result => {
           this.getMRPDocumnets();
         }, error => {
    
           this.isLoading = false;;
           alert(`Document "${item.document.title}" is used. Could not be deleted.`);
       });
     }
    }
  }

}



