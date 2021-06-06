import { Component, OnInit } from '@angular/core';
import { Observer } from 'src/app/home/observer/observer';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { Transmittal } from '../../models/transmittal';
import { State, GroupDescriptor,process } from '@progress/kendo-data-query';
import { TransmittalService } from '../../services/transmittal.service';
import { Subject } from 'src/app/home/observer/subject';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { EnumCoding } from 'src/app/modules/general/enums/enum-coding';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { TransmittalDetailComponent } from './transmittal-detail/transmittal-detail.component';
import { UploadTransmittalComponent } from './upload-transmittal/upload-transmittal.component';

@Component({
  selector: 'app-transmittals',
  templateUrl: './transmittals.component.html',
  styleUrls: ['./transmittals.component.css']
})
export class TransmittalsComponent implements  OnInit,Observer {

  isLoading : boolean;
  gridView: GridDataResult; 
  transmittals: Transmittal[] 
  public groups: GroupDescriptor[] = [];
  public selectionRows: any[] = [];
  state: State = {
    skip: 0,
    take: 10,
    group: this.groups
  };

  constructor(public transmittalService : TransmittalService,private router: Router,
                   public subject: Subject,private dialog: MatDialog) {
    this.transmittals = [];
    this.subject = subject;
    this.subject.attach(this);
   }

  ngOnInit() {
    this.getTransmittals();
  }
  
  refresh(): void {
    this.getTransmittals();
  }

  getTransmittals() : void {    
    if (!isNullOrUndefined(this.subject.getState()))
    {
        this.isLoading = true;
        this.transmittalService.getList('AllTransmittal',`${this.subject.getState().id}`)
        .subscribe( (result : any) =>  {
           this.isLoading = false;
           _.forEach(result.data,(m : any) => {
            m.creationDate = new Date(m.creationDate);
            m.transmittalDate = new Date(m.transmittalDate);
           }); 
           this.transmittals = result.data;
           this.setGrid();
         });  
      }
      else
      {
        this.clearNewTaskGrid();
      } 
  }
  
  clearNewTaskGrid()
  {
    this.transmittals = [];
    this.selectionRows = [];
    this.setGrid();
  }
  
  private setGrid(): void {      
    this.gridView = process(this.transmittals,this.state);   
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.setGrid();
  }

/* 
  public editRow(row: any)
  {
      this.router.navigate([`/home/task/plannedTaskApproval/${row.id}`]);       
  }  */

  getTransmittalType(id)
    {
      if (!isNullOrUndefined(id))
        return EnumCoding.TransmittalTypes.find((t : any) => t.id == id).title;
    }

public new()
{
    this.openDetail(null);
}

public edit()
{
    if (this.selectionRows.length > 0)
    {
       var item = this.transmittals.find((row: any) => { return row.id ==  this.selectionRows[0];})
       this.openDetail(item);
    }
    else
    {
      alert(`Please, Select a Transmittal`);
    }
}

public openDetail(row : any)
  {
       const dialogConfig = new MatDialogConfig();

       dialogConfig.disableClose = true;
       dialogConfig.autoFocus = false;
       dialogConfig.width = "700px";
       dialogConfig.height = "500px";
       dialogConfig.data = row;

       const dialogRef = this.dialog.open(TransmittalDetailComponent, dialogConfig);
       dialogRef.afterClosed().subscribe(result => {
          if (!isNullOrUndefined(result))
             this.getTransmittals();

         });    
   }
 
   delete()
   {
     if (this.selectionRows.length > 0)
     { 
      var item = this.transmittals.find((row: any) => { return row.id ==  this.selectionRows[0];})
      if(confirm(`Are you sure to delete  "${item.transmittalNo}"`)) {
        this.isLoading = true;
         this.transmittalService.Delete(item).subscribe( result => {
            this.getTransmittals();
          }, error => {
     
            this.isLoading = false;;
            alert(`Transmittal "${item.transmittalNo}" is used. Could not be deleted.`);
        });
      }   
     }
     else
     {
       alert(`Please, Select a Transmittal`);
     }
   }

   viewDocuments()
   {
      if (this.selectionRows.length > 0)
      {
         this.router.navigate([`/home/document/transmittalDocument/${this.selectionRows[0]}`]);       
      }
      else
      {
        alert(`Please, Select a Transmittal`);
      }
    }

    printPreview(row: any)
    {
        this.router.navigate([`/home/document/transmittalReport/${row.id}/${row.projectId}`]);       
    } 

    autoArchive(row: Transmittal)
    {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.width = "500px";
      dialogConfig.height = "400px";
      dialogConfig.data = row;

      const dialogRef = this.dialog.open(UploadTransmittalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        // if (!isNullOrUndefined(result))
            this.getTransmittals();

        });    
    }

    copyTransmittal()
    {
      if (this.selectionRows.length > 0)
      {
       var item = this.transmittals.find((row: any) => { return row.id ==  this.selectionRows[0];})
       var copy = new Transmittal();
       copy.copiedTransmittalId = item.id;
       copy.transmittalType = item.transmittalType;
       copy.projectId = item.projectId;
       copy.transmittalDate = new Date();
       this.openDetail(copy);
      }
      else
      {
        alert(`Please, Select a Transmittal`);
      }
    }

}

