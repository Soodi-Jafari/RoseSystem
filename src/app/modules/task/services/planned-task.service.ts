import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { ApprovalFlow } from 'src/app/models/approval-flow';
import { PlannedTask } from '../models/planned-task';

@Injectable()
export class PlannedTaskService extends  BaseService<PlannedTask> {
  filterChange: any;
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'PlannedTask';
  }

/*    public getListLookup(actionName: string = '',  urlParams: string = ''): Observable<object> {
    const urlStr = this.makeApiUrl(actionName,urlParams);
    return this.httpClient.get<object>(urlStr);
  } */

  public GetDocuments(actionName: string = '', model : object): Observable<PlannedTask> {
    const url = this.makeApiUrl(actionName);
    return this.httpClient.post<PlannedTask>(url,model);
  }

  public ChangeState(model: ApprovalFlow): Observable<boolean> {
    const url = this.makeApiUrl() + '/changestate';
    return this.httpClient.post<boolean>(url, model);
  }

  public batchSaveTask(model: Array<PlannedTask>): Observable<boolean> {
    const url = this.makeApiUrl() + '/batchSave';
    return this.httpClient.post<boolean>(url, model);
  } 

  public editTask(model:PlannedTask): Observable<boolean> {
    const url = this.makeApiUrl() + '/editTask';
    return this.httpClient.post<boolean>(url, model);
  } 
  public getUserExpertLookup(  urlParams: string = ''): Observable<object> {
    const urlStr = this.globalConfigService.apiUrl + `/api/common/UserExpertDiscipline/${urlParams}`;
    return this.httpClient.get<object>(urlStr);
  }

  public ChangeTasksTitle(model: object): Observable<boolean> {
    const url = this.makeApiUrl() + '/ChangeTaskDocumentTitle';
    return this.httpClient.post<boolean>(url, model);
  }

  public saveFileDataCenter(model: any): Observable<boolean> {
    const url =this.globalConfigService.apiUrl + '/api/files/SaveFileInDataCenter';
    return this.httpClient.post<boolean>(url, model);
  } 

  public ReturnToPreStep(model: PlannedTask): Observable<boolean> {
    const url = this.makeApiUrl() + '/BacktoPreState';
    return this.httpClient.post<boolean>(url, model);
  }

  public SetAutoArchive(model: PlannedTask): Observable<boolean> {
    const url = this.makeApiUrl() + '/AutoArchived';
    return this.httpClient.post<boolean>(url, model);
  }
  public getDocumentPlanTimesheetTime(model: object): Observable<object> {
    const urlStr = this.makeApiUrl() + `/GetDocumentPlanTimesheetTime`;
    return this.httpClient.post<object>(urlStr,model);
  }
}
