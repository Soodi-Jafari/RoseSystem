import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Transmittal } from 'src/app/modules/task/models/transmittal';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { TransmittalDocument } from 'src/app/modules/task/models/transmittal-document';
import { LookupValue } from 'src/app/models/lookup-value';
import { FormGroup, FormBuilder } from '@angular/forms';
import { State, process } from '@progress/kendo-data-query';
import { TransmittalDocumentService } from 'src/app/modules/task/services/transmittal-document.service';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';
import { EditService } from 'src/app/services/edit.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CommentFilesComponent } from '../../comment-files/comment-files.component';

@Component({
  selector: 'add-comment-document',
  templateUrl: './add-comment-document.component.html',
  styleUrls: ['./add-comment-document.component.css']
})
export class AddCommentDocumentComponent implements OnInit{

  @Input() public transmittal: Transmittal;
  @Output() documentsAddChanged = new EventEmitter<boolean>();
  @ViewChild("grid") private grid: GridComponent;

  isLoading : boolean;
  documents : TransmittalDocument[];
  selectedDocuments : TransmittalDocument[];
  purposeOfIssues: Array<LookupValue>;
  pageTypes : any[]; 
  formGroup: FormGroup;
  selectionRows: any[] = [];
  public gridView: GridDataResult;  
  public state: State = {
    skip: 0,
    take: 5
  };
  tranDocSelectionRows: any[] = [];
  public tranDocGridView: GridDataResult;  
  public docGridState: State = {
  skip: 0,
  take: 10
  };

  constructor(public docService : TransmittalDocumentService,private formBuilder: FormBuilder, 
               private editService: EditService,private dialog: MatDialog) { 

      this.documents =[];
      this.selectedDocuments = [];
  }

  ngOnInit() {
    this.pageTypes = EnumCoding.PageTypes;
    this.getLookups();
    this.getDocuments();   
  }

  public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
    if (!isEdited) {
        sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    }
}

public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;
    if (!formGroup.valid) {
         // prevent closing the edited cell if there are invalid values.
        args.preventDefault();
    } else if (formGroup.dirty) {
        this.editService.assignValues(dataItem, formGroup.value);
        this.editService.update(dataItem);
    }
}

public createFormGroup(dataItem: any): FormGroup {
  return this.formBuilder.group({
      'purposeOfIssue': dataItem.purposeOfIssue,
      'sheetNo': dataItem.sheetNo,
      'pageType': dataItem.pageType
  });
}

getTransmittalPageType(id)
{
  if (!isNullOrUndefined(id))
    return EnumCoding.PageTypes.find((t : any) => t.id == id).title;
}

setGrid()
{
  this.gridView = process(this.selectedDocuments,this.state);
}
setDocGrid()
{
  this.tranDocGridView = process(this.documents,this.docGridState);
}


getDocuments()
{
  this.isLoading = true;
  this.docService.getList('IssuedTransmittalDocuments',`${this.transmittal.projectId}`)
   .subscribe( (result : any) =>  {
     this.isLoading = false;
     this.documents = result.data;
     this.setDocGrid();
   }, error => {    
    this.isLoading = false;
  });   
  
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.setGrid();
  }

  public transDocdataStateChange(state: DataStateChangeEvent): void {
    this.docGridState = state;
    this.setDocGrid();
  }
  
  getLookups()
  {
    this.isLoading = true;
    this.docService.getListLookup('GetLookups',`${this.transmittal.transmittalType}`).subscribe((data : any) => 
    {
        this.isLoading = false;
        this.purposeOfIssues = data.purposeOfIssues;
    }, error => {    
      this.isLoading = false;
    });  
  }
  
  public purposeOfIssueTitle(id: number): any {
    if (!isNullOrUndefined(id))
       return this.purposeOfIssues.find((x: any) => x.id === id);
  }

  addToList()
  {
    if (this.tranDocSelectionRows.length == 0)
    {
         alert("Please, Select at least one Document");
          return;
    }
    for (let index = 0; index < this.tranDocSelectionRows.length; index++) {
      if (!this.selectedDocuments.some((row: any) => { return row.id ==  this.tranDocSelectionRows[index];}))
      {
         var item = this.documents.find((row: any) => { return row.id ==  this.tranDocSelectionRows[index];})  
         var doc = new TransmittalDocument();
         doc.id = item.id;
         doc.documentTitle = item.documentTitle;
         doc.projectId = item.projectId;
         doc.revision = item.revision;
         doc.documentNo = item.documentNo;
         doc.disciplineId = item.disciplineId;
         doc.disciplineName = item.disciplineName;         
         this.selectedDocuments.push(doc);
      }
    }  
    this.setGrid(); 
    this.tranDocSelectionRows = [];
  }
  save()
  {
    this.grid.closeCell();
    if (this.selectedDocuments.length == 0)
    {
         alert("Please, Select at least one Document");
          return;
    }
    this.transmittal.transmittalDocuments = [];
    for (let index = 0; index < this.selectedDocuments.length; index++) {
      var item = this.selectedDocuments.find((row: any) => { return row.id ==  this.selectedDocuments[index].id;}) 
      var doc = new TransmittalDocument();
      doc.documentTitle = item.documentTitle;
      doc.projectId = item.projectId;
      doc.revision = item.revision;
      doc.documentNo = item.documentNo;
      doc.disciplineId = item.disciplineId;
      doc.disciplineName = item.disciplineName; 
      doc.sheetNo = item.sheetNo;
      doc.pageType = item.pageType;  
      doc.purposeOfIssue = item.purposeOfIssue;    
      doc.parentId =  item.id;
      doc.id = 0;
      doc.fileAttachs = item.fileAttachs;
      doc.transmittal = new Transmittal();
      doc.transmittal.id = this.transmittal.id;     
      this.transmittal.transmittalDocuments.push(doc);
    }
 
   var notSelectStatus = _.some(this.transmittal.transmittalDocuments, (item : any) =>  isNullOrUndefined(item.purposeOfIssue));
   if (notSelectStatus)
   {
     alert("Please, Select Purpose Of Issue!");
     return;
    }
    this.isLoading = true;
    this.docService.PostTransmital(this.transmittal).subscribe( result => {
      this.isLoading = false;
      this.documentsAddChanged.emit(true);
    }, error => {
      this.isLoading = false;
      var errMessage ='';
      if (error.error.length > 0)
         error.error.forEach((err: string) => errMessage = errMessage +  err + '\n');           
      else
         errMessage = error.error.ExceptionMessage;

      alert(errMessage);
    });
  }

  delete()
  {
    if (this.selectionRows.length > 0)
    { 
     var item = this.selectedDocuments.find((row: any) => { return row.id ==  this.selectionRows[0];})
     if(confirm(`Are you sure to delete  "${item.documentNo}"`)) {
        _.remove( this.selectedDocuments,(row: any) =>   row.id ==  item.id);
        this.setGrid();
        this.selectionRows = [];
     }
    }
  }

  AddFiles(row : any)
  { 
   const dialogConfig = new MatDialogConfig();
 
   dialogConfig.disableClose = true;
   dialogConfig.autoFocus = false;
   dialogConfig.width = "700px";
   dialogConfig.height = "400px";
   var doc = row;
   doc.transmittal = { transmittalNo : this.transmittal.transmittalNo, customer: this.transmittal.customer};
   dialogConfig.data = doc;
 
   const dialogRef = this.dialog.open(CommentFilesComponent, dialogConfig);
   dialogRef.afterClosed().subscribe(result => {
      if (result !== null)
      {
        var item = this.selectedDocuments.find((row: any) => { return row.id ==  row.id;}) 
        item.fileAttachs = result.fileAttachs; 
      }
      
    });
  }
 
}
