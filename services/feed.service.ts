import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {of, Subject} from "rxjs";
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import {HomeFeed} from "../model/homefeed.type";

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  protected baseURL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  storeHomeFeed(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/home-feed-store', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  updateHomeFeed(homeFeedObj: Object,id: any){
    return this.http.put<any>(this.baseURL+'/home-feed-update/'+id, homeFeedObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getValueHomeFeed(id: any){
    return this.http.get<any>(this.baseURL+'/home-feed-edit/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  onDeleteHomeFeed(id: number){
    return this.http.delete<any>(this.baseURL+'/home-feed-delete/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  homeFeedOrderUpdate(videoObj: Object) {
    return this.http.post<any>(this.baseURL + '/home-feed-order-update', videoObj)
      .pipe(map((res: any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }


  storeCourseFeed(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/course-feed-store', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  updateCourseFeed(courseFeedObj: Object,id: number){
    return this.http.put<any>(this.baseURL+'/course-feed-update/'+id, courseFeedObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getValueCourseFeed(id: number){
    return this.http.get<any>(this.baseURL+'/course-feed-edit/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  onDeleteCourseFeed(id: number){
    return this.http.delete<any>(this.baseURL+'/course-feed-delete/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  courseOrderUpdate(videoObj: Object) {
    return this.http.post<any>(this.baseURL + '/course-order-update', videoObj)
      .pipe(map((res: any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  storeShortFeed(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/short-feed-store', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  updateShortFeed(artistObj: Object,id: number){
    return this.http.put<any>(this.baseURL+'/short-feed-update/'+id, artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getValueShortFeed(id: any){
    return this.http.get<any>(this.baseURL+'/short-feed-edit/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  onDeleteShortFeed(id: number){
    return this.http.delete<any>(this.baseURL+'/short-feed-delete/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
    shortOrderUpdate(videoObj: Object) {
    return this.http.post<any>(this.baseURL + '/short-order-update', videoObj)
      .pipe(map((res: any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }


  getShortFeedList(){
    return this.http.get<any>(this.baseURL+'/shorts-feed-list')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  getCourseFeedList(){
    return this.http.get<any>(this.baseURL+'/course-feed-list')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  searchHero(term?: string) : Observable<any[]> {
    if (term && term.length>3) {

      const searchParam="search%5Bvalue%5D="+encodeURIComponent(term)+"&search%5Bregex%5D=false";
      return this.http.get<any>(`${this.baseURL}/hero-banner-grid?dT=true&autocomplete=true&${searchParam}`).pipe(map(rsp =>rsp.data));
    } else {
      return of([]);
    }
  }


  getFeed(type:number){
    let url = this.baseURL+'/v1/home?real=true&admin=1&type='

    switch(type){
      case 0:
        url=url+"mobile";
        break;
      case 1:
        url=url+"tv";
        break;
      case 2:
        url=url+"web";
        break;
      default:
        url=url+"web";
        break;
    }
    return this.http.get<HomeFeed>(url)
      .pipe(map((res:any) => {
        return res.data;
      }));
  }
}
