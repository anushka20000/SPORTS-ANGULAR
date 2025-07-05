import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from "rxjs";
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import {environment} from '../../environments/environment';
import * as AWS from 'aws-sdk';

//import 'rxjs/add/observable/of';
import { FileUpload } from '../model/file-upload';
import { of } from 'rxjs';
interface AssociativeArray {
  [key: string]: any
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  protected baseURL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {
  }

  store(transObj: Object){
    return this.http.post<any>(this.baseURL+'/admin/video-catalogue/store', transObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  updatevideo(transObj: Object){
    return this.http.put<any>(this.baseURL+'/admin/video/update', transObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  addMatchVideo(transObj: Object){
    return this.http.post<any>(this.baseURL+'/admin/match-video/store', transObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  editMatchVideo(transObj: Object){
    return this.http.put<any>(this.baseURL+'/admin/match-video/update', transObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  generateJSON(id: number){
    return this.http.get<any>(this.baseURL+'/generate-JSON/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  createJOB(id: number){
    return this.http.get<any>(this.baseURL+'/admin/create-job/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  onDeleteCatelog(id: number){
    return this.http.delete<any>(this.baseURL+'/admin/video-catalogue/delete/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  deleteMatchVideo(id: number){
    return this.http.delete<any>(this.baseURL+'/admin/match-video/delete/'+id)
      .pipe(map((res:any) => {
        console.log(res);
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  deleteVideoCategory(id: number){
    return this.http.delete<any>(this.baseURL+'/admin/video-category/delete/'+id)
      .pipe(map((res:any) => {
        console.log(res);
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  refreshJOB(id: number){
    return this.http.get<any>(this.baseURL+'/admin/get-job-status/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getValueCatlouge(id: number){
    return this.http.get<any>(this.baseURL+'/TransCodeResource/'+id+'/edit')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getCatalogue(id: number){
    return this.http.get<any>(this.baseURL+'/admin/video-catalogue/edit/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  updateCatelog(transCodeObj: Object,id: number){
    return this.http.put<any>(this.baseURL+'/TransCodeResource/'+id, transCodeObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  updateCatelogue(transCodeObj: Object,id: number){
    return this.http.put<any>(this.baseURL+'/admin/video-catalogue/update/'+id, transCodeObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getCatalogVideos(hero_banner:number,term?: string) : Observable<any[]> {
    if (term && term.length>3) {

      const searchParam="search%5Bvalue%5D="+encodeURIComponent(term)+"&search%5Bregex%5D=false";



      return this.http.get<any>(`${this.baseURL}/video-catalogues?dT=true&autocomplete=true&hero_banner=${hero_banner}&${searchParam}`).pipe(map(rsp =>rsp.data));
    } else {
      return of([]);
    }
  }
  videoAdd(videoObj: Object){
    return this.http.post<any>(this.baseURL+'/video-store', videoObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getValue(id: number){
    return this.http.get<any>(this.baseURL+'/Videos/'+id+'/edit')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  
  update(artistObj: Object,id: number){
    return this.http.put<any>(this.baseURL+'/video-update/'+id, artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  onDelete(id: number){
    return this.http.delete<any>(this.baseURL+'/Videos/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  orderUpdate(videoObj: Object){
    return this.http.post<any>(this.baseURL+'/video-order-update', videoObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
}


