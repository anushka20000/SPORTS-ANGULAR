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
export class PlayerService {

    protected baseURL = `${environment.apiUrl}`;


  constructor(private http: HttpClient) { }

 
  addPlayer(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/admin/player/store', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  editPlayer(artistObj: Object){
    return this.http.put<any>(this.baseURL+'/admin/player/update', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  destroy(id: any){
    return this.http.delete<any>(this.baseURL+'/admin/player/delete/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getPositions(){
    return this.http.get<any>(this.baseURL+'/admin/positions')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getClubs(){
    return this.http.get<any>(this.baseURL+'/admin/clubs')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getCountries(){
    return this.http.get<any>(this.baseURL+'/get-countries')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
}
