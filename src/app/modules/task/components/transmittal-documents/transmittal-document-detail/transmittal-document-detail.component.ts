import { Component, OnInit } from '@angular/core';
import { Transmittal } from '../../../models/transmittal';
import { GridDataResult, DataStateChangeEvent, EditService } from '@progress/kendo-angular-grid';
import { State,process } from '@progress/kendo-data-query';
import { TransmittalService } from '../../../services/transmittal.service';
import { TransmittalDocumentService } from '../../../services/transmittal-document.service';
import { Subject } from 'src/app/home/observer/subject';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { TransmittalType } from 'src/app/modules/general/enums/transmittal-type.enum';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DocumentFilesComponent } from '../document-files/document-files.component';
import { CommentFilesComponent } from '../comment-files/comment-files.component';

@Component({
  selector: 'app-transmittal-document-detail',
  templateUrl: './transmittal-document-detail.component.html',
  styleUrls: ['./transmittal-document-detail.component.css']
})
export class TransmittalDocumentDetailComponent implements OnInit {

  isLoading : boolean;
  viewModel : Transmittal;
  tranDocGridView: GridDataResult; 
  isNewDocumentMode: boolean;
  isIssueForClient: boolean;
  public tranDocSelectionRows: any[] = [];
  state: State = {
    skip: 0,
    take: 10
  };

  constructor(public docService : TransmittalDocumentService,public transmittalService : TransmittalService,public subject: Subject,
                 private route: ActivatedRoute,private dialog: MatDialog,private router: Router) {

      this.viewModel = new Transmittal();
      this.subject.attach(this);
      this.viewModel.id = parseInt(this.route.snapshot.paramMap.get('id'))
   }

  ngOnInit() {
    this.getTransmittal();
  }

  refresh(): void {
  }

  getTransmittal()
  {
    this.isLoading = true;
    this.transmittalService.getSingle('GetSingle', `${this.viewModel.id}`).subscribe((result : any) =>
    {
      this.isLoading = false;
      this.viewModel = result.model;
      if (this.viewModel.transmittalDocuments.length > 0)
      {
          this.isNewDocumentMode = false;
          this.setTransDocGrid();
      }
      else
          this.isNewDocumentMode = true;
      this.isIssueForClient = this.viewModel.transmittalType == TransmittalType.IssueForClient ||  this.viewModel.transmittalType == TransmittalType.IssueForContractor;
      if (isNullOrUndefined(this.subject.getState()) || this.viewModel.projectId != this.subject.getState().id)
           this.subject.projectId = this.viewModel.projectId;          
    }, error => {    
      this.isLoading = false;
    });   
  }
    
  private setTransDocGrid(): void {      
    this.tranDocGridView = process(this.viewModel.transmittalDocuments,this.state);   
  }

  public transDocdataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.setTransDocGrid();
  }

 getTransmittalType(id)
 {
    if (!isNullOrUndefined(id))
      return EnumCoding.TransmittalTypes.find((t : any) => t.id == id).title;
 }
 getTransmittalPageType(id)
 {
   if (id > 0)
     return EnumCoding.PageTypes.find((t : any) => t.id == id).title;
 }

 newDocument()
 {
    this.isNewDocumentMode = true;
 }
 
 delete()
 {
   if (this.tranDocSelectionRows.length > 0)
   { 
    var item = this.viewModel.transmittalDocuments.find((row: any) => { return row.id ==  this.tranDocSelectionRows[0];})
    if(confirm(`Are you sure to delete  "${item.documentNo}"`)) {
      this.isLoading = true;
       this.docService.Delete(item).subscribe( result => {
          this.getTransmittal();
        }, error => {   
          this.isLoading = false;;
          alert(`Transmittal Document "${item.documentNo}" is used. Could not be deleted.`);
      });
    }
   }
 }

 onDocumentsAdded(added : boolean)
 {
     this.isNewDocumentMode = !added;
     this.getTransmittal();
 }

 ShowFiles(row : any)
 { 
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = false;
  dialogConfig.width = "700px";
  dialogConfig.data = row;

  if (this.isIssueForClient == true)
  {
     dialogConfig.height = "550px";
     this.dialog.open(DocumentFilesComponent, dialogConfig);
  }
  else 
  {   
     dialogConfig.height = "400px";
     this.dialog.open(CommentFilesComponent, dialogConfig);
  }
 
 }
 
 printPreview()
 {
     this.router.navigate([`/home/document/transmittalReport/${this.viewModel.id}/${this.viewModel.projectId}`]);       
 } 

}
