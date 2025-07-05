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
export class SubscriptionService {

  protected baseURL = `${environment.apiUrl}`;


  constructor(private http: HttpClient) { }
  getLeaguelist()
  {
    return this.http.get<any>(this.baseURL+'/admin/league-list')
      .pipe(map((res:any) => {
        // console.log(res);
        return res.data;
      }));
  }
  store(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/admin/subscription-plan/store', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  update(artistObj: Object){
    return this.http.put<any>(this.baseURL+'/admin/subscription-plan/update', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getValue(id: number){
    return this.http.get<any>(this.baseURL+'/admin/subscription-plan/edit/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getAllSubscriptions(){
    return this.http.get<any>(this.baseURL+'/admin/subscription-plans')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  // getAllTransaction(){
  //   return this.http.post<any>(this.baseURL+'/admin/transactions')
  //     .pipe(map((res:any) => {
  //       return res;
  //       // login successful if there's a jwt token in the response
  //     }));
  // }
  getTransactionDetails(payload: any): Observable<any> {
    return this.http.post(this.baseURL + '/admin/transactions', payload);
  }
  
  
  onDelete(id: number){
    return this.http.delete<any>(this.baseURL+'/admin/subscription-plan/delete/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getActiveZones(){
    return this.http.get<any>(this.baseURL+'/get-all-zone'+'?version='+Math.random())
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  subscriptionRequestStore(subscriptionRequestObj: Object){
    return this.http.post<any>(this.baseURL+'/v1/subscription-request-step-one', subscriptionRequestObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getSubscriptionRequestDetails(id:any){
    return this.http.get<any>(this.baseURL+'/get-subscription-request?subscription_request_id='+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  getUserSubscriptionRequests(id:any){
    return this.http.get<any>(this.baseURL+'/getUserHistory?id='+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  updateSubscriptionRequest(artistObj: Object,id: number){
    return this.http.put<any>(this.baseURL+'/subscription-request-update/'+id, artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

}
