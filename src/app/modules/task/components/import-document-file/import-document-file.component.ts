import { Component, OnInit, ViewChild } from '@angular/core';
import { FileRestrictions, SuccessEvent, ErrorEvent } from '@progress/kendo-angular-upload';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { isNullOrUndefined } from 'util';
import { TransmittalService } from '../../services/transmittal.service';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { ProjectService } from 'src/app/modules/baseinfo/services/project.service';
import { LookupValue } from 'src/app/models/lookup-value';
import { switchMap, tap, delay, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'app-import-document-file',
  templateUrl: './import-document-file.component.html',
  styleUrls: ['./import-document-file.component.css']
})
export class ImportDocumentFileComponent implements OnInit {

  @ViewChild("projectList") projectList;
  uploadSaveUrl = '';
  project: LookupValue;
  //viewModel: any;
  successMessege: string;
  errorMessege: string;
  isLoading: boolean;
  documents: any[];
  public projects: Array<LookupValue>
  public sourceProjects: Array<LookupValue>
  myRestrictions: FileRestrictions = {
    maxFileSize: 100000000
  };
  
  gridView: GridDataResult;
    
  state: State = {
    skip: 0,
    take: 10,
 };
  constructor(private globalConfigService: GlobalConfigService,public docService: TransmittalService, public projectService: ProjectService) { }

    ngOnInit() {
    this.successMessege = "";
    this.documents = [];
    this.getProjects()
  }
  
  ngAfterViewInit() {
    const projectContain = value => s => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
 
    this.projectList.filterChange.asObservable().pipe(
          switchMap(value => from([this.sourceProjects]).pipe(
              tap(() => this.projectList.loading = true),
              delay(1000),
              map((items) => items.filter(projectContain(value)))
          ))
      )
      .subscribe(x => {
          this.projects = x;
      });    
  }
  
  successEventHandler(e: SuccessEvent) {
     this.successMessege = e.response.body;
     this.getDocuments(this.project.id);
     setTimeout(() => {
      this.successMessege = null;
    }, 5000);
    
  } 

  errorEventHandler(e) {
    this.errorMessege = e.response.error;
    setTimeout(() => {
      this.errorMessege = null;
    }, 5000);
    
  }
  getDocuments(id: number) : void {   

      this.isLoading = true;
      this.docService.getPrimaveraDocuments(`${id}`)
         .subscribe( (result : any) =>  {
           this.isLoading = false;
           this.documents = result.data;
           this.setGrid();
         }, error => {    
          this.isLoading = false;
        });  
  }
  
  clearNewTaskGrid()
  {
    this.documents = [];
    this.setGrid();
  }
  
  private setGrid(): void {      
    this.gridView = process(this.documents,this.state);   
  }

  getProjects()
  {
    this.isLoading = true;
    this.projectService.getListLookup('AllPrimaveraProjectIds').subscribe((data : any) => 
    {
        this.isLoading = false;
        this.projects = this.sourceProjects = data.data;
    }, error => {    
      this.isLoading = false;
    });    
  }

  public projectSelectionChange(value: any): void {
    if (!isNullOrUndefined(value))
    {
       this.getDocuments(value.id);
       this.uploadSaveUrl = this.globalConfigService.apiUrl + `/api/pmdocument/UpdateDocumentWeight/${value.id}`;
    }
    else
      this.clearNewTaskGrid()
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.setGrid();
  }
  
}
