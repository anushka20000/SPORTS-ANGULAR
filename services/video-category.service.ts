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
export class VideoCategoryService {

    protected baseURL = `${environment.apiUrl}`;


  constructor(private http: HttpClient) { }

  store(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/VideoCategories', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  update(artistObj: Object,id: number){
    return this.http.put<any>(this.baseURL+'/VideoCategories/'+id, artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  updatecategory(artistObj: Object){
    return this.http.put<any>(this.baseURL+'/admin/video-category/update',artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getValue(id: number){
    return this.http.get<any>(this.baseURL+'/VideoCategories/'+id+'/edit')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  onDelete(id: number){
    return this.http.delete<any>(this.baseURL+'/VideoCategories/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getVideoByCategory(id: number){
    return this.http.get<any>(this.baseURL+'/get-category-videos?id='+id)
      .pipe(map((res:any) => {
        return res;

      }));
  }
  getVideoByCategoryForOrder(id:number)
  {
    return this.http.get<any>(this.baseURL+'/get-video-row-by-category?category_id='+id)
      .pipe(map((res:any) => {
        return res.data;

      }));

  }
  getReorder(videoObj:any,id:any){
    return this.http.get<any>(this.baseURL+'api/reOrder-category-videos?id='+videoObj.id+'&catgoryID='+videoObj.video_category_id+'&oldOrder='+videoObj.category_order+'&newOrder='+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  getReorderPages(videoObj:any,id:any){
    return this.http.get<any>(this.baseURL+'api/reOrder-page-section?id='+videoObj.id+'&pageId='+videoObj.page_id+'&oldOrder='+videoObj.order+'&newOrder='+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  searchCourses(term?: string) : Observable<any[]> {
    if (term && term.length>3) {

      const searchParam="search%5Bvalue%5D="+encodeURIComponent(term)+"&search%5Bregex%5D=false";
      return this.http.get<any>(`${this.baseURL}/videoCategoryList?dT=true&autocomplete=true&${searchParam}`).pipe(map(rsp =>rsp.data));
    } else {
      return of([]);
    }
  }

  searchShorts(term?: string) : Observable<any[]> {
    if (term && term.length>3) {

      const searchParam="search%5Bvalue%5D="+encodeURIComponent(term)+"&search%5Bregex%5D=false";
      return this.http.get<any>(`${this.baseURL}/videos-grid?dT=true&video_category_id=83&autocomplete=true&${searchParam}`).pipe(map(rsp =>rsp.data));
    } else {
      return of([]);
    }
  }


  storeCoursePricing(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/save-Course-pricing', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getValueCoursePricing(id:any){
    return this.http.get<any>(this.baseURL+'/course-pricing-zone-by-category?video_category_id='+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

}
