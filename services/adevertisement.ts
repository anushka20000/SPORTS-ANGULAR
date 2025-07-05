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
export class AdvertisementService {

  protected baseURL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {
  }

  store(transObj: Object){
    return this.http.post<any>(this.baseURL+'/admin/advertisement/store', transObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  update(transObj: Object){
    return this.http.put<any>(this.baseURL+'/admin/advertisement/update', transObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }


 
}


