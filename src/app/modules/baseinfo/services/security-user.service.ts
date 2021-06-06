import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { SecurityUser } from '../models/security-user';

@Injectable()

export class SecurityUserService extends  BaseService<SecurityUser> {
  constructor(private httpClient: HttpClient, globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'SecurityUser';
  }

}