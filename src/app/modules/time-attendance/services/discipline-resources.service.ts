import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { DisciplineResource } from '../models/discipline-resource';
import { Observable } from 'rxjs-compat/Observable';
import { LookupValue } from 'src/app/models/lookup-value';

@Injectable()

export class DisciplineResourcesService extends  BaseService<DisciplineResource> {
  constructor(private httpClient: HttpClient, private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'DisciplineResource';
  }

/*   public GetDisiplinePlanReport(model: object): Observable<Array<TimeSheetReport>> {
    const url =  this.makeApiUrl() +  `/CurrentUserProjectRoles`;
    return this.httpClient.post<Array<TimeSheetReport>>(url,model );
  } */
  
  public GetEngineeringDisciplines(urlParams: string = ''): Observable<LookupValue> {
    const url = this.makeApiUrl() +  `/ProjectDisciplines/${urlParams}`;
    return this.httpClient.get<LookupValue>(url);
  }
  public batchSave(model: Array<DisciplineResource>): Observable<boolean> {
    const url = this.makeApiUrl() + '/batchSave';
    return this.httpClient.post<boolean>(url, model);
  } 

  public GetAllProjects(): Observable<object> {
    const actionStr = `/api/project/ActiveProjects`;
    return this.httpClient.get<object>(this.globalConfigService.apiUrl + actionStr);
  }

}