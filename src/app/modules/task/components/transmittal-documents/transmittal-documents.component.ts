import { Component, OnInit } from '@angular/core';
import { Observer } from 'src/app/home/observer/observer';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { TransmittalDocument } from '../../models/transmittal-document';
import { GroupDescriptor, State, process } from '@progress/kendo-data-query';
import { TransmittalDocumentService } from '../../services/transmittal-document.service';
import { Subject } from 'src/app/home/observer/subject';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';

@Component({
  selector: 'app-transmittal-documents',
  templateUrl: './transmittal-documents.component.html',
  styleUrls: ['./transmittal-documents.component.css']
})
export class TransmittalDocumentsComponent implements OnInit,Observer {

  isLoading : boolean;
  gridView: GridDataResult; 
  transmittalDocs: TransmittalDocument[] 
  public groups: GroupDescriptor[] = [];
 // public selectionRows: any[] = [];
  state: State = {
    skip: 0,
    take: 10,
    group: this.groups
  };

  constructor(public transmittalService : TransmittalDocumentService,public subject: Subject) {
    this.transmittalDocs = [];
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
        this.transmittalService.getList('AllTransmittalDocuments',`${this.subject.getState().id}`)
        .subscribe( (result : any) =>  {
           this.isLoading = false;
           _.forEach(result.data,(m : any) => {
              m.creationDate = new Date(m.creationDate);
              m.transmittal.transmittalDate = new Date(m.transmittal.transmittalDate);
           }); 
           this.transmittalDocs = result.data;
           this.setGrid();
         }, error => {    
          this.isLoading = false;
        });    
      }
      else
      {
        this.clearNewTaskGrid();
      } 
  }
  
  clearNewTaskGrid()
  {
    this.transmittalDocs = [];
    this.setGrid();
  }
  
  private setGrid(): void {      
    this.gridView = process(this.transmittalDocs,this.state);   
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.setGrid();
  }

/*   getTransmittalType(id)
    {
      if (!isNullOrUndefined(id))
        return EnumCoding.TransmittalTypes.find((t : any) => t.id == id).title;
    } */

/*    viewDocuments()
   {
      if (this.selectionRows.length > 0)
      {
         this.router.navigate([`/home/document/transmittalDocument/${this.selectionRows[0]}`]);       
      }
      else
      {
        alert(`Please, Select a Transmittal`);
      }
    } */
}