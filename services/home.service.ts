import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {of, Subject} from "rxjs";
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

    protected baseURL = `${environment.apiUrl}`;


  constructor(private http: HttpClient) { }
  addItem(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/admin/home/store', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  editItem(artistObj: Object){
    return this.http.put<any>(this.baseURL+'/admin/item/update', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  addHomeItem(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/admin/item/store', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  fetchMatchDetails(id: any){
    return this.http.get<any>(this.baseURL+'/admin/fetch-match-details/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }


}
