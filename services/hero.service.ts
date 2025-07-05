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
export class HeroService {

    protected baseURL = `${environment.apiUrl}`;


  constructor(private http: HttpClient) { }

  store(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/Hero-banner', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  update(artistObj: Object,id: number){
    console.log('ddd dfdf');
    return this.http.put<any>(this.baseURL+'/Hero-banner/'+id, artistObj)
      .pipe(map((res:any) => {
        console.log('ddd');
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getValue(id: number){
    return this.http.get<any>(this.baseURL+'/Hero-banner/'+id+'/edit')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getActiveKeywords(){
    return this.http.get<any>(this.baseURL+'/Hero-banner/get-active-keywords'+'?version='+Math.random())
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  onDelete(id: number){
    return this.http.delete<any>(this.baseURL+'/Hero-banner/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getChnageStatus(id: number){
    return this.http.get<any>(this.baseURL+'/Hero-banner-change-status/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getDashboardStat(){
    return this.http.get<any>(this.baseURL+'/dashboard-stats')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
}
