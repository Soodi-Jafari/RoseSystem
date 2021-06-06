import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { GridDataResult, GridComponent } from '@progress/kendo-angular-grid';
import { State,process } from '@progress/kendo-data-query';
import { EditService } from '../../../../../../services/edit.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { LookupValue } from 'src/app/models/lookup-value';
import { FileRestrictions, SuccessEvent, SelectEvent, UploadEvent } from '@progress/kendo-angular-upload';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { MrpDialogData } from '../mrps.component';
import { CBE, CBEPricing } from '../../models/cbe';
import { CBEService } from '../../services/cbe.service';
import { MRP } from '../../models/mrp';
import * as _ from 'lodash';

export interface DialogData {
  mrp: MRP;
}

@Component({
  selector: 'app-cbes',
  templateUrl: './cbes.component.html',
  styleUrls: ['./cbes.component.css']
})
export class CbesComponent implements OnInit {

  @ViewChild("grid") private grid: GridComponent;
  isLoading: any
  viewModel : CBE
  currencyUnits : Array<LookupValue>;
  public gridView: GridDataResult;  
  public gridState: State = {
      sort: [],
      skip: 0,
      take: 5
  };


  public formGroup: FormGroup;
  //public changes: any = {};
  uploadSaveUrl = '';
  myRestrictions: FileRestrictions = {
    maxFileSize: 100000000
  };
  
  constructor(private formBuilder: FormBuilder, public editService: EditService,
              private globalConfigService : GlobalConfigService,
              public cbeService : CBEService, public dialogRef: MatDialogRef<CbesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MrpDialogData) {
            this.viewModel = new CBE();
            this.isLoading = true;
   }

  public ngOnInit(): void {
      this.getCurrencyUnits();
      this.getCbe();
  }

  getCbe()
  {
     this.cbeService.getSingle('GetSingle', this.data.mrp.id.toString()).subscribe((result : any) => 
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

      }, error => {    
        this.isLoading = false;
      });  
  }

  setFileUrl()
  {
    this.uploadSaveUrl = this.globalConfigService.apiUrl + `/api/files/upload/1/${this.data.mrp.mrpNo}/3/${this.viewModel.cbeNo}`;
  }
  

  getVendors()
  {
      this.cbeService.getListLookup('GetQualifiedMRPVendors', this.data.mrp.id.toString()).subscribe((data : any) => 
      {
          this.isLoading = false;
          var max = _.maxBy(this.viewModel.cbePricings,'id');
          var indx = isNullOrUndefined(max) ? 0 : max.id;
          data.data.forEach((it : any) => {
            if (!this.viewModel.cbePricings.some(i => i.mrpVendorId === it.id))
            {
               var ran = new CBEPricing();
               ran.id = indx + 1 ;
               ran.mrpVendorId = it.id;
               ran.vendorName = it.title;
               this.viewModel.cbePricings.push(ran);
            }
          });
          this.gridView = process(this.viewModel.cbePricings,this.gridState);
      });
  }

  public currencyUnit(id: number): any {
    return this.currencyUnits.find((x: any) => x.id === id);
}


  getCurrencyUnits()
  {
      this.cbeService.getListLookup('GetLookups').subscribe((data : any) => 
      {
        this.currencyUnits = data.currencyUnits;        
      });
  }
  public onStateChange(state: State) {
    this.gridState = state;
    this.gridView = process(this.viewModel.cbePricings,this.gridState);

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

  closeDialog() {
    this.dialogRef.close();
  }

  public createFormGroup(dataItem: any): FormGroup {
      return this.formBuilder.group({
          'basePrice': dataItem.basePrice,
          'currencyPrice': dataItem.currencyPrice,
          'currencyUnit': dataItem.currencyUnit,
          'description': dataItem.description
      });
  }

  save()
  {

     this.grid.closeCell()
     this.viewModel.mrpId = this.data.mrp.id;
     if (isNullOrEmptyString(this.viewModel.cbeNo) || isNullOrUndefined(this.viewModel.cbeDate))
     {
        alert("Please enter required fields!");
        return;
     }
     this.isLoading = true;
     this.cbeService.Post(this.viewModel).subscribe( result => {
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

