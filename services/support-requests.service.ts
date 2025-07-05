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
export class SupportRequestsService {
  protected baseURL = `${environment.apiUrl}`;
  constructor(private http: HttpClient) { }

  createSupportRequest(requestObj: Object){
    return this.http.post<any>(this.baseURL+'/support-requests', requestObj)
      .pipe(map((res:any) => {
        return res;
      }));
  }
  getSupportRequest(id:number){
    return this.http.get<any>(this.baseURL+'/support-requests/'+id)
      .pipe(map((res:any) => {
        return res.data;
      }));
  }
  getSupportRequestDetails(id:number){
    return this.http.get<any>(this.baseURL+'/v1/support-request-details/'+id)
      .pipe(map((res:any) => {
        return res.data;
      }));
  }

  updateSupportRequest(requestObj: Object,id: number){
    return this.http.put<any>(this.baseURL+'/support-requests/'+id, requestObj)
      .pipe(map((res:any) => {
        return res;
      }));
  }
  onDelete(id: number){
    return this.http.delete<any>(this.baseURL+'/support-requests/'+id)
      .pipe(map((res:any) => {
        return res;
      }));
  }
  supportRequestMessageSave(requestObj: Object){
    return this.http.post<any>(this.baseURL+'/backend-support-request-message-save', requestObj)
      .pipe(map((res:any) => {
        return res;
      }));
  }
  supportRequestStatusChange(requestObj: Object){
    return this.http.post<any>(this.baseURL+'/backend-support-request-status-change', requestObj)
      .pipe(map((res:any) => {
        return res;
      }));
  }
}
