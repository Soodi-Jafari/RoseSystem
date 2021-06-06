import { Injectable } from '@angular/core';
import { GlobalConfigService } from './global-config.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor (private http: HttpClient, private globalConfig: GlobalConfigService) {
  }

  
  private _currentProject : Project;
  public get CurrentProject() : Project {
    return this._currentProject;
  }
  public set CurrentProject(v : Project) {
    this._currentProject = v;
  }
  

  public GetAllProjects(): Observable<object> {
    const actionStr = `/api/common/GetAllProjects`;
    return this.http.get<object>(this.globalConfig.apiUrl + actionStr);
  }

  public GetUserOrganizationRole(): Observable<object> {
    const actionStr = `/api/common/UserOrganizationRole`;
    return this.http.get<object>(this.globalConfig.apiUrl + actionStr);
  }
  public GetUserOrganizationRolePositions(): Observable<object> {
    const actionStr = `/api/common/UserOrganizationRolePositions`;
    return this.http.get<object>(this.globalConfig.apiUrl + actionStr);
  }
}

