import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { GlobalConfigService } from 'src/app/services/global-config.service';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';

@Injectable()

export class CustomerService extends  BaseService<Customer> {
  constructor(private httpClient: HttpClient, globalConfigService: GlobalConfigService) {
    super( httpClient, globalConfigService );
    this.controllerName = 'customer';
  }

  public getCustomerTypes(): Observable<object> {
    const urlStr = this.makeApiUrl('CustomerTypes');
    return this.httpClient.get<object>(urlStr);
  }

}