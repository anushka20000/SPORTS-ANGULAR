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
export class ZoneService {

  protected baseURL = `${environment.apiUrl}`;


  constructor(private http: HttpClient) { }

  store(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/Zone', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  update(artistObj: Object,id: number){
    return this.http.put<any>(this.baseURL+'/Zone/'+id, artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getValue(id: number){
    return this.http.get<any>(this.baseURL+'/Zone/'+id+'/edit')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  onDelete(id: number){
    return this.http.delete<any>(this.baseURL+'/Zone/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getActiveZones(){
    return this.http.get<any>(this.baseURL+'/get-all-zone'+'?version='+Math.random())
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

}
