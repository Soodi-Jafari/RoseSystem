import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { GridDataResult, GridComponent } from '@progress/kendo-angular-grid';
import { State,process } from '@progress/kendo-data-query';
import { EditService } from '../../../../../../services/edit.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { FileRestrictions, SuccessEvent } from '@progress/kendo-angular-upload';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { MrpDialogData } from '../mrps.component';
import { MRP } from '../../models/mrp';
import { TBE, TBERanking } from '../../models/tbe';
import { TBEService } from '../../services/tbe.service';
import * as _ from 'lodash';

export interface DialogData {
  mrp: MRP;
}


@Component({
  selector: 'app-tbes',
  templateUrl: './tbes.component.html',
  styleUrls: ['./tbes.component.css']
})
export class TbesComponent implements OnInit {

  @ViewChild("grid") private grid: GridComponent;

  isLoading: boolean;
  viewModel : TBE
  public gridView: GridDataResult;  
  public gridState: State = {
      sort: [],
      skip: 0,
      take: 5
  };

  public changes: any = {};
  uploadSaveUrl = '';
  myRestrictions: FileRestrictions = {
    maxFileSize: 100000000
  };


  constructor(private formBuilder: FormBuilder, public editService: EditService,
              private globalConfigService : GlobalConfigService,
              public tbeService : TBEService, public dialogRef: MatDialogRef<TbesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MrpDialogData) {
            this.viewModel = new TBE();
            this.isLoading = true;
   }

  public ngOnInit(): void {

      this.getTbe();
  }

  getTbe()
  {
     this.tbeService.getSingle('GetSingle', this.data.mrp.id.toString()).subscribe((result : any) => 
     {
       if ( isNullOrUndefined(result.model))
       {
          this.getVendors();
       }
       else
       {
          this.viewModel = result.model;
          this.setFileUrl();
          this.getVendors();
       }

      });
  }

  setFileUrl()
  {
    this.uploadSaveUrl = this.globalConfigService.apiUrl + `/api/files/upload/1/${this.data.mrp.mrpNo}/4/${this.viewModel.tbeNo}`;
  }
  getVendors()
  {
      this.tbeService.getListLookup('GetMRPVendors', this.data.mrp.id.toString()).subscribe((data : any) => 
      {
          this.isLoading = false;
          var max = _.maxBy(this.viewModel.tbeRankings,'id');
          var indx = isNullOrUndefined(max) ? 0 : max.id;
          data.data.forEach((it : any) => {
            if (!this.viewModel.tbeRankings.some(i => i.mrpVendorId === it.id))
            {
               var ran = new TBERanking ();
               ran.id = indx + 1 ;
               ran.mrpVendorId = it.id;
               ran.vendorName = it.title;
               this.viewModel.tbeRankings.push(ran);
            }
          });
          this.gridView = process(this.viewModel.tbeRankings,this.gridState);
      });
  }

  public onStateChange(state: State) {
    this.gridState = state;
    this.gridView = process(this.viewModel.tbeRankings,this.gridState);
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

  successEventHandler(e: SuccessEvent) {

    this.viewModel.fileName = e.files[0].name;
    this.viewModel.fileSize = e.files[0].size;
    this.viewModel.filePath = e.response.body.url;
  } 
  
   fileSizeFormat(size: number)
   {
      var s = Math.round(size/1000)
      return s.toString() + 'K';
    }

  closeDialog() {
    this.dialogRef.close();
  }

  public createFormGroup(dataItem: any): FormGroup {
      return this.formBuilder.group({
          'ranking': dataItem.ranking,
          'isQualified': dataItem.isQualified,
          'description': dataItem.description
      });
  }

  save()
  {
    this.grid.closeCell();
    if (isNullOrEmptyString(this.viewModel.tbeNo) || isNullOrUndefined(this.viewModel.tbeDate))
    {
      alert("Please enter required fields!");
       return;
    }

    this.isLoading = true;
     this.viewModel.mrpId = this.data.mrp.id;
     this.tbeService.Post(this.viewModel).subscribe( result => {
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

  getPath()
  {
    return this.globalConfigService.apiUrl + '/' + this.viewModel.filePath;
  }

  deleteFile()
  { 
     if(confirm(`Are you sure to delete  "${this.viewModel.fileName}"`)) {

      this.viewModel.fileName = undefined;
      this.viewModel.fileSize = undefined;
      this.viewModel.filePath = undefined;
    
      }
    }
}
