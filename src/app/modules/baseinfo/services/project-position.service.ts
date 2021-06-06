import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { Observable } from 'rxjs';
import { ProjectPosition } from '../models/project-position';

@Injectable()

export class ProjectPositionService extends  BaseService<ProjectPosition> {
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'projectPosition';
  }

  public getListLookup(actionName: string = ''): Observable<object> {
    const urlStr = this.makeApiUrl(actionName);
    return this.httpClient.get<object>(urlStr);
  }

  
  public getPositions(): Observable<object> {
    const urlStr = this.makeApiUrl("ProjectizedPositions");
    return this.httpClient.get<object>(urlStr);
  }

  public GetAllProjects(): Observable<object> {
    const actionStr = `/api/project/activeProjects`;
    return this.httpClient.get<object>(this.globalConfigService.apiUrl + actionStr);
  }
}