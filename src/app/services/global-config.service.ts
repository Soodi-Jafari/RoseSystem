import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GlobalConfigService {
  // public  apiUrl = 'http://localhost:48581';
  // public  apiUrl = 'http://10.22.1.2:8040';
  // public  apiUrl = 'http://pmis.saff-rosemond.local:80';  
   public  apiUrl = 'http://pmis:8040';
    
}