import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { LookupValue } from 'src/app/models/lookup-value';
import { AttachFile } from 'src/app/models/attach-file';
import { UploadEvent, SuccessEvent, SelectEvent, FileRestrictions } from '@progress/kendo-angular-upload';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { isNullOrUndefined } from 'util';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State,process } from '@progress/kendo-data-query';
import * as _ from 'lodash';
import { MRP } from '../../../models/mrp';
import { MrpDocument } from '../../../models/mrp-document';
import { MRPDocumentService } from '../../../services/mrp-document.service';

export interface DialogData {
  mrpDocument: any;
  mrp: MRP;
}

@Component({
  selector: 'app-mrpdocument-detail',
  templateUrl: './mrpdocument-detail.component.html',
  styleUrls: ['./mrpdocument-detail.component.css']
})
export class MrpdocumentDetailComponent implements OnInit {

   @ViewChild("docList") docList;

  isLoading: boolean;
  public sourceDocs: Array<LookupValue>
  public documents: Array<LookupValue>
  viewModel : MrpDocument;

  uploadSaveUrl = ''; // should represent an actual API endpoint
  uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint
  myRestrictions: FileRestrictions = {
    maxFileSize: 100000000
  };
  
  public gridView: GridDataResult;
  public state: State = {
    skip: 0,
    take: 5
      
};

  constructor(public docService : MRPDocumentService,private globalConfigService : GlobalConfigService, public dialogRef: MatDialogRef<MrpdocumentDetailComponent>,
                   @Inject(MAT_DIALOG_DATA) public data: DialogData) {
                    this.viewModel = new MrpDocument();        
                    this.isLoading = true;
   }

  ngOnInit(){
    this.getDocuments();
   
    if (!isNullOrUndefined(this.data.mrpDocument))
        this.getMrpDocument(this.data.mrpDocument.id); 
  }
 
   ngAfterViewInit() {
    const docContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;

    this.docList.filterChange.asObservable().pipe(
          switchMap(value => from([this.sourceDocs]).pipe(
              tap(() => this.docList.loading = true),
              delay(1000),
              map((items) => items.filter(docContain(value)))
          ))
      )
      .subscribe(x => {
          this.documents = x;
      });     
  }
 
  getMrpDocument(id: number)
  {
    this.docService.getSingle('GetSingle', id.toString()).subscribe((result : any) => 
    {
       this.viewModel = result.model;
       this.uploadSaveUrl = this.globalConfigService.apiUrl + `/api/files/upload/1/${this.data.mrp.mrpNo}/2/${this.viewModel.document.title}`;
       this.setGrid();
      }, error => {    
        this.isLoading = false;
      });  
  }

  getDocuments()
  {
    this.docService.GetNotMRDocuments(this.data.mrp.projectId).subscribe((data : any) => 
    {
        this.isLoading = false;
        this.documents = this.sourceDocs = data.data;;
    }, error => {    
      this.isLoading = false;
    });  
  }

  private setGrid(): void {      
    this.gridView = process(this.viewModel.documentAttachs,this.state);
   }

  public dataStateChange(state: DataStateChangeEvent): void {
  this.state = state;
  this.setGrid();
   }

  docSelectionChange(value: any): void {     
    this.uploadSaveUrl = this.globalConfigService.apiUrl +  `/api/files/upload/1/${this.data.mrp.mrpNo}/2/${value.title}`;
  }
  
  save()
  {
    if (isNullOrUndefined(this.viewModel.document))
    {
      alert("Please enter required fields!");
      return;
    }
    this.isLoading = true;
    this.viewModel.mrpId = this.data.mrp.id;
    this.docService.Post(this.viewModel).subscribe( result => {
        this.dialogRef.close(this.viewModel);
        this.isLoading = false;
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

  closeDialog() {
    this.dialogRef.close();
  }

successEventHandler(e: SuccessEvent) {

  var attachFile = new AttachFile();
  attachFile.fileName = e.files[0].name;
  attachFile.fileSize = e.files[0].size;
  attachFile.path = e.response.body.url;
  this.viewModel.documentAttachs.push(attachFile);
  this.setGrid();
} 

 fileSizeFormat(size: number)
 {
    var s = Math.round(size/1000)
    return s.toString() + 'K';
  }

  getPath(file : AttachFile)
  {
    return this.globalConfigService.apiUrl + '/' + file.path;
  }

  deleteFile(row: any)
  {   
     if(confirm(`Are you sure to delete  "${row.fileName}"`)) {
      _.remove(this.viewModel.documentAttachs,function(n) {
        return n == row;
          });
         this.setGrid();    
      }
    }

}



