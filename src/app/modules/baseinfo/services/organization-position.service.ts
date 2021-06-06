import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { Observable } from 'rxjs';
import { OrganizationPosition } from '../models/organization-position';

@Injectable()

export class OrganizationPositionService extends  BaseService<OrganizationPosition> {
  constructor(private httpClient: HttpClient,private globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'OrganizationPosition';
  }

  public getListLookup(actionName: string = ''): Observable<object> {
    const urlStr = this.makeApiUrl(actionName);
    return this.httpClient.get<object>(urlStr);
  }

  
  public getOrganizationChart(): Observable<object> {
    const urlStr = this.makeApiUrl("OrganizationChart");
    return this.httpClient.get<object>(urlStr);
  }

  
}