import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { LookupValue } from 'src/app/models/lookup-value';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State,process } from '@progress/kendo-data-query';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditService } from 'src/app/services/edit.service';
import { Transmittal } from 'src/app/modules/task/models/transmittal';
import { TransmittalDocumentService } from 'src/app/modules/task/services/transmittal-document.service';
import { isNullOrUndefined } from 'util';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { TransmittalDocument } from 'src/app/modules/task/models/transmittal-document';
import * as _ from 'lodash';
import { TransmittalService } from 'src/app/modules/task/services/transmittal.service';

@Component({
  selector: 'add-issue-document',
  templateUrl: './add-issue-document.component.html',
  styleUrls: ['./add-issue-document.component.css']
})
export class AddIssueDocumentComponent implements OnInit {

  @Input() public transmittal: Transmittal;
  @Output() documentsAddChanged = new EventEmitter<boolean>();
  @ViewChild("grid") private grid: GridComponent;

  isLoading : boolean;
  documents : TransmittalDocument[];
  purposeOfIssues: Array<LookupValue>;
  pageTypes : any[]; 
  formGroup: FormGroup;
  selectionRows: any[] = [];
  public gridView: GridDataResult;  
  public state: State = {
    skip: 0,
    take: 10
};

  constructor(public docService : TransmittalDocumentService,private formBuilder: FormBuilder, 
               private editService: EditService, public transmittalService : TransmittalService) { 

      this.documents =[];
  }

  ngOnInit() {
    this.pageTypes = EnumCoding.PageTypes;
    this.getLookups();
    if (this.transmittal.copiedTransmittalId > 0 && this.transmittal.transmittalDocuments.length == 0)
        this.getParentTransmittal(this.transmittal.copiedTransmittalId);
    else
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
      'revision': dataItem.revision,
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
  this.gridView = process(this.documents,this.state);
}

getDocuments()
{
  this.isLoading = true;
  this.docService.getList('AllApprovedDocuments',`${this.transmittal.projectId}/${this.transmittal.customer.id}`)
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
  
  getParentTransmittal(id: number)
  {
    this.isLoading = true;
    this.transmittalService.getSingle('GetSingle', id.toString()).subscribe((result: any) => 
     {
        this.isLoading = false;
        this.documents = result.model.transmittalDocuments;    
        this.setGrid();    
     }, error => {    
      this.isLoading = false;
    });  
  }

  public purposeOfIssueTitle(id: number): any {
    if (!isNullOrUndefined(id))
       return this.purposeOfIssues.find((x: any) => x.id === id);
  }

  save()
  {
    this.grid.closeCell();
    if (this.selectionRows.length == 0)
    {
         alert("Please, Select at least one Document");
          return;
    }
    this.transmittal.transmittalDocuments = [];
    for (let index = 0; index < this.selectionRows.length; index++) {
      var item = this.documents.find((row: any) => { return row.id ==  this.selectionRows[index];}) 
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
      doc.taskId =  item.taskId > 0 ? item.taskId : item.id;
      doc.id = 0;
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
}
