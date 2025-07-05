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
export class CmsService {

    protected baseURL = `${environment.apiUrl}`;


  constructor(private http: HttpClient) { }

  store(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/CMS', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  update(artistObj: Object,id: number){
    return this.http.put<any>(this.baseURL+'/CMS/'+id, artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getValue(id: number){
    return this.http.get<any>(this.baseURL+'/CMS/'+id+'/edit')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  onDelete(id: number){
    return this.http.delete<any>(this.baseURL+'/CMS/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

}
