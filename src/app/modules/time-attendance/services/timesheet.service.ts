import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { LookupValue } from 'src/app/models/lookup-value';
import { Timesheet } from '../models/timesheet';
import { EventStates } from '../models/event-states';
import { OrganizationPosition } from '../../baseinfo/models/organization-position';
import { ProjectPosition } from '../../baseinfo/models/project-position';
import { TimeSheetReport } from '../models/time-sheet-report';

@Injectable()
export class TimesheetService extends  BaseService<Timesheet> {

  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'timesheet';
  }

/*   public GetUserProjects(): Observable<object> {
    const actionStr = `/api/common/UserProjects`;
    return this.httpClient.get<object>(this.globalConfigService.apiUrl + actionStr);
  } */
  public BatchChangeState(model: Array<EventStates>): Observable<boolean> {
    const url = this.makeApiUrl() + '/BatchChangeState';
    return this.httpClient.post<boolean>(url, model);
  } 

  public ChangeState(model: EventStates): Observable<boolean> {
    const url = this.makeApiUrl() + '/ChangeState';
    return this.httpClient.post<boolean>(url, model);
  } 
  public GetAllProjects(): Observable<object> {
    const actionStr = `/api/timesheetreport/UserActiveProjects`;
    return this.httpClient.get<object>(this.globalConfigService.apiUrl + actionStr);
  }

  public GetProjectUsers( model: object): Observable<LookupValue> {
    const actionStr = `/api/timesheetreport/ProjectPositionUsers`;
    return this.httpClient.post<LookupValue>(this.globalConfigService.apiUrl + actionStr,model);
  }

  public GetOrganizationUsers(): Observable<LookupValue> {
    const actionStr = `/api/timesheetreport/OrganizationUsers`;
    return this.httpClient.get<LookupValue>(this.globalConfigService.apiUrl + actionStr);
  }
  public GetTimeSheetReport(model: object): Observable<Array<TimeSheetReport>> {
    const actionStr = `/api/timesheetreport/TimeSheetReport`;
    return this.httpClient.post<Array<TimeSheetReport>>(this.globalConfigService.apiUrl + actionStr,model );
  }
  public GetTimeSheetProjectReport(model: object): Observable<Array<TimeSheetReport>> {
    const actionStr = `/api/timesheetreport/TimeSheetProjectReport`;
    return this.httpClient.post<Array<TimeSheetReport>>(this.globalConfigService.apiUrl + actionStr,model );
  }
  public GetTimeSheetAllReport(model: object): Observable<Array<TimeSheetReport>> {
    const actionStr = `/api/timesheetreport/TimeSheetAllReport`;
    return this.httpClient.post<Array<TimeSheetReport>>(this.globalConfigService.apiUrl + actionStr,model );
  }
  public GetTimeSheetChartReport(model: object): Observable<Array<TimeSheetReport>> {
    const actionStr = `/api/timesheetreport/TimeSheetChartReport`;
    return this.httpClient.post<Array<TimeSheetReport>>(this.globalConfigService.apiUrl + actionStr,model );
  }
  public GetDateDuration( model: object): Observable<string> {
    const url = this.makeApiUrl() +  `/GetDateDuration`;
    return this.httpClient.post<string>(url,model);
  }
  public GetCurrentUserOrgRoles(): Observable<OrganizationPosition> {
    const url = this.makeApiUrl() +  `/CurrentUserOrgRoles`;
    return this.httpClient.get<OrganizationPosition>(url);
  }
  public GetCurrentUserProjectRoles(): Observable<ProjectPosition> {
    const url =  this.makeApiUrl() +  `/CurrentUserProjectRoles`;
    return this.httpClient.get<ProjectPosition>(url);
  }
  public GetFiscallyears(): Observable<LookupValue> {
    const url =  this.makeApiUrl() +  `/Fiscallyears`;
    return this.httpClient.get<LookupValue>(url);
  }
  public GetUserInOuts(model: object): Observable<object> {
    const actionStr  = `/api/timesheetreport/CurrentUserInOuts`;
    return this.httpClient.post<object>(this.globalConfigService.apiUrl + actionStr, model);
  }
  public getUserAttendance( urlParams: string = ''): Observable<object> {
    const actionStr  = `/api/timesheetreport/UserAttendance/${urlParams}`;
    return this.httpClient.get<object>(this.globalConfigService.apiUrl + actionStr);
  }
  public GetDisiplinePlanReport(model: object): Observable<Array<TimeSheetReport>> {
    const actionStr = `/api/timesheetreport/DisiplinePlanReport`;
    return this.httpClient.post<Array<TimeSheetReport>>(this.globalConfigService.apiUrl + actionStr,model );
  }
  public GetDisiplinePlanResourcesReport(): Observable<Array<TimeSheetReport>> {
    const actionStr = `/api/timesheetreport/DisiplinePlanResourcesReport`;
    return this.httpClient.get<Array<TimeSheetReport>>(this.globalConfigService.apiUrl + actionStr );
  }
  public getPersonnelOnOff( urlParams: string = ''): Observable<object> {
    const actionStr  = `/api/timesheetreport/PersonnelOnOff/${urlParams}`;
    return this.httpClient.get<object>(this.globalConfigService.apiUrl + actionStr);
  }
}
