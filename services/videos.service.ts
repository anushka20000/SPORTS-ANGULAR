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
export class VideosService {

    protected baseURL = `${environment.apiUrl}`;


  constructor(private http: HttpClient) { }

  addVideo(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/admin/video/store', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  addVideoCategory(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/admin/video-category/store', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getSubscriptionPlans(){
    return this.http.get<any>(this.baseURL+'/subscription-plan')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  editVideo(artistObj: Object){
    return this.http.put<any>(this.baseURL+'/admin/video/update', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
 

}
