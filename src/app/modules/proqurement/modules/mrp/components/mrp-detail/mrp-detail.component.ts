
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { isNullOrUndefined } from 'util';
import { MRP } from '../../models/mrp';
import { MRDocument } from '../../models/mr-document';
import { MRPService } from '../../services/mrp.service';

export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-mrp-detail',
  templateUrl: './mrp-detail.component.html',
  styleUrls: ['./mrp-detail.component.css']
})

 export class MrpDetailComponent implements OnInit {
  @ViewChild("docList") docList;
 
  isLoading: boolean;
  viewModel : MRP;
  documents: Array<MRDocument>
  sourceDocuments: Array<MRDocument> 
  isEditMode : boolean;

  constructor(public mrpService : MRPService,public commonService :CommonService,public dialogRef: MatDialogRef<MrpDetailComponent>,
                   @Inject(MAT_DIALOG_DATA) public data: DialogData) {

         this.isEditMode = data === null ? false : true;        
         this.viewModel = new MRP();   
         this.isLoading = true;
   }

  ngOnInit(){
    
    if (!this.isEditMode)
    {
       this.viewModel.projectId = this.commonService.CurrentProject.id;
       this.getMRLookup();
    }

    if (!isNullOrUndefined(this.data))
        this.getMrp(this.data.id);
  }
 
  ngAfterViewInit() {
    if (!this.isEditMode)
    {
    const contains = (value: { toLowerCase?: any; }) => (s: { mrShortName: { toLowerCase: () => { indexOf: (arg0: any) => number; }; }; }) => s.mrShortName.toLowerCase().indexOf(value.toLowerCase()) !== -1;

    this.docList.filterChange.asObservable().pipe(
          switchMap(value => from([this.sourceDocuments]).pipe(
              tap(() => this.docList.loading = true),
              delay(1000),
              map((docs) => docs.filter(contains(value)))
          ))
      )
      .subscribe(x => {
          this.documents = x;
      });
    }
  }

  getMrp(id: number)
  {
    this.mrpService.getSingle('GetSingle', id.toString()).subscribe((result: any) => 
    {
      this.isLoading = false;
      this.viewModel = result.model;  
    }, error => {    
      this.isLoading = false;
    });  
  }
  
  getMRLookup()
  {
    this.mrpService.GetMRDocuments("GetMRDocuments",this.commonService.CurrentProject.pmProjectId.toString()).subscribe((result : any) =>     {
       this.documents =  this.sourceDocuments =  result.data;
       this.isLoading = false;
    });
  }

  public selectionChange(value: MRDocument): void {
    this.viewModel.mrpNo = value.mrShortName;
    this.viewModel.title = value.mrTitle;
    this.viewModel.mrDocumentId = value.id;
    this.viewModel.disciplineId = value.disciplineId;
    this.viewModel.disciplineTitle = value.disciplineName;
    this.viewModel.planInquiryStart = value.startDate;
    this.viewModel.planInquiryEnd = value.endDate;
  }

  save()
  {
    if (isNullOrUndefined(this.viewModel.mrDocumentId))
             {
                  alert("Please enter required fields!");
                  return;

             }
    this.isLoading = true;  
    this.mrpService.Post(this.viewModel).subscribe( result => {
        this.isLoading = false;
        this.dialogRef.close(this.viewModel);
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


}

