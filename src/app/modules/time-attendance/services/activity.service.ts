import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { Activity } from '../models/activity';

@Injectable()

export class ActivityService extends  BaseService<Activity> {
  constructor(private httpClient: HttpClient, globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'activity';
  }

  
}