import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { Project } from '../models/project';
import { Observable } from 'rxjs';

@Injectable()

export class ProjectService extends  BaseService<Project> {
  constructor(private httpClient: HttpClient, globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'project';
  }

  public getListLookup(actionName: string = ''): Observable<object> {
    const urlStr = this.makeApiUrl(actionName);
    return this.httpClient.get<object>(urlStr);
  }

}