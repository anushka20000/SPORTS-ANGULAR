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
export class LeagueService {

    protected baseURL = `${environment.apiUrl}`;


  constructor(private http: HttpClient) { }

 
  addLeague(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/admin/league/store', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  addLeagueGroup(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/admin/league-group-club/store', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  editLeague(artistObj: Object){
    return this.http.put<any>(this.baseURL+'/admin/league/update', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  fetchleagueGroup(id: number){
    return this.http.get<any>(this.baseURL+'/admin/league-group-clubs/'+ id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  onDelete(id: number){
    return this.http.delete<any>(this.baseURL+'/admin/league/delete/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getLeagues()
  {
    return this.http.get<any>(this.baseURL+'/league-list-for-match')
      .pipe(map((res:any) => {
        return res.data;
      }));
  }

  getGroups()
  {
    return this.http.get<any>(this.baseURL+'/admin/groups')
      .pipe(map((res:any) => {
        return res.data;
      }));
  }
  getClubs()
  {
    return this.http.get<any>(this.baseURL+'/clubs')
      .pipe(map((res:any) => {
        return res.data;
      }));
  }
}
