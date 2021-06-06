import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { Project } from '../models/project';
import { Observable } from 'rxjs';
import { PCTLevel } from '../models/pct-level';
import { LookupValue } from 'src/app/models/lookup-value';

@Injectable()

export class PCTService extends  BaseService<PCTLevel> {
  constructor(private httpClient: HttpClient, globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'pct';
  }

  public getListLookup(actionName: string = '',params: string = ''): Observable<object> {
    const urlStr = this.makeApiUrl(actionName,params);
    return this.httpClient.get<object>(urlStr);
  }

}