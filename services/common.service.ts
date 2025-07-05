import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Subject} from "rxjs";
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  protected baseURL = `${environment.apiUrl}`;
  constructor(private http: HttpClient) { }

  getCountries(){
    return this.http.get<any>(this.baseURL+'/v1/getCountries')
      .pipe(map((res:any) => {
        return res.data;

      }));
  }
  getZones(){
    return this.http.get<any>(this.baseURL+'/zone-value-list')
      .pipe(map((res:any) => {
        return res.data;
      }));
  }

  getDurations() {
    return this.http.get<any>(this.baseURL+'/duration-list')
      .pipe(map((res:any) => {
        return res.data;
      }));
  }

  getPans(){
    return this.http.get<any>(this.baseURL+'/subscription-grid?dT=true&autoComplete=true')
      .pipe(map((res:any) => {
        return res.data;
      }));
  }
}
