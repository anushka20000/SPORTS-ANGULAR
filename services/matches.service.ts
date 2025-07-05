import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Subject} from "rxjs";
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import {MatchFB} from "../model/matchDetails";

@Injectable({
  providedIn: 'root'
})
export class MatchService {

    protected baseURL = `${environment.apiUrl}`;


  constructor(private http: HttpClient) { }

  store(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/admin/match/store', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  harvest(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/harvest-match', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  refresh(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/harvest-status', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  update(artistObj: Object){
    return this.http.put<any>(this.baseURL+'/admin/match/update/', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  edit(id: number){
    return this.http.get<any>(this.baseURL+'/admin/match/edit/'+id)
      .pipe(map((res:any) => {
        return res.data;
      }));
  }
  getValue(id:number)
  {
    return this.http.get<any>(this.baseURL+'/match-detail/'+id)
      .pipe(map((res:any) => {
        return res.data;
      }));
  }
  getLeagues()
  {
    return this.http.get<any>(this.baseURL+'/leagues')
      .pipe(map((res:any) => {
        // console.log(res);
        return res.data;
      }));
  }
  getLeaguelist()
  {
    return this.http.get<any>(this.baseURL+'/admin/league-list')
      .pipe(map((res:any) => {
        // console.log(res);
        return res.data;
      }));
  }
  getleagues()
  {
    return this.http.get<any>(this.baseURL+'/groups')
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

  getleagueClubs(id: number)
  {
    return this.http.get<any>(this.baseURL+'/admin/league-group-clubs/'+ id)
      .pipe(map((res:any) => {
        return res.data;
      }));
  }
  onDelete(id: number){
    return this.http.delete<any>(this.baseURL+'/admin/match/delete/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  // POST /v1/match-score and send a json data
  postMatchScore(data: MatchFB): Observable<any> {
    // Call the Cloud Function with the data to be written to Firestore
    return this.http.post(this.baseURL+'/match-score', data);
  }

  startMatch(data:any): Observable<any> {
    // Call the Cloud Function with the data to be written to Firestore
    return this.http.post(this.baseURL+'/start-match', data);
  }

  closeMatch(data:any): Observable<any> {
    // Call the Cloud Function with the data to be written to Firestore
    return this.http.post(this.baseURL+'/close-match', data);
  }

  channelStatus(id:number)
  {
    return this.http.get<any>(this.baseURL+'/channel-status?id='+id)
        .pipe(map((res:any) => {
          return res;
        }));
  }
  startChannel(id:number,channel_id:number): Observable<any> {
    // Call the Cloud Function with the data to be written to Firestore
    return this.http.post(this.baseURL+'/start-channel?id='+id+"&channel_id="+channel_id, {});
  }

  stopChannel(id:number): Observable<any> {
    // Call the Cloud Function with the data to be written to Firestore
    return this.http.post(this.baseURL+'/stop-channel?id='+id, {});
  }





}
