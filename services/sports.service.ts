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
export class SportsService {

    protected baseURL = `${environment.apiUrl}`;


  constructor(private http: HttpClient) { }

  update(artistObj: Object,id: number){
    console.log('ddd dfdf');
    return this.http.put<any>(this.baseURL+'/User/'+id, artistObj)
      .pipe(map((res:any) => {
        console.log('ddd');
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  changePasswordStudent(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/admin-change-password', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getValue(id: number){
    return this.http.get<any>(this.baseURL+'/admin/user-purchase/details/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  markPaid(id: number){
    return this.http.get<any>(this.baseURL+'/admin/mark-paid/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getSubscriptionId(id: any){
    return this.http.get<any>(this.baseURL+'api/get-current-subscription-plan?&userId='+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getOrderHistoryId(id: any){
    return this.http.get<any>(this.baseURL+'api/subscription-history?&id='+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getExtendSubscriptionId(id: any){
    return this.http.get<any>(this.baseURL+'api/check-subscribe-user?&userId='+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getSubscription(){
    return this.http.get<any>(this.baseURL+'api/get-plan')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getLeagues(){
    return this.http.get<any>(this.baseURL+'/leagues')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getPlans(){
    return this.http.get<any>(this.baseURL+'/subscription-plan')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getMatches(id: number){
    return this.http.get<any>(this.baseURL+'/league-match/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  createOrder(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/create-admin-order', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getSubscriptionPlanById(id:any){
    return this.http.get<any>(this.baseURL+'api/get-plan-by-id/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  adduser(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/admin/user/store', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getActiveKeywords(){
    return this.http.get<any>(this.baseURL+'api/keyword/get-active-keywords'+'?version='+Math.random())
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  onDelete(id: number){
    return this.http.delete<any>(this.baseURL+'/User/'+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  DeleteSubscriptionById(id: number){
    return this.http.get<any>(this.baseURL+'api/delete-subscription?id='+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  DeleteOrderById(id: number){
    return this.http.get<any>(this.baseURL+'api/delete-order?id='+id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

  search(value:string): Observable<any> {

    //console.log(value);

    return this.http.get<any>(this.baseURL + "api/get-song-search?searchStr="+ value)
    // .pipe(
    //     tap((response: IUserResponse) => {
    //       response.results = response.results
    //         .map(user => new User(user.id, user.name))
    //         // Not filtering in the server since in-memory-web-api has somewhat restricted api
    //         .filter(user => user.name.includes(filter.name))

    //       return response;
    //     })
    //   );
    .pipe(map((res:any) => {
      //console.log(res);
      return res;
      // login successful if there's a jwt token in the response
    }));
  }

  totalSubs(fromDate:any,toDate:any,search:any){
    return this.http.get<any>(this.baseURL+"api/Total-subs-grid?dT=true&startDate="+btoa(fromDate)+'&endDate='+btoa(toDate))
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }

//   totalSubsForPartner(fromDate:any,toDate:any,importedFrom:null,subStatus:null){
//     return this.http.get<any>(this.baseURL+"api/Total-subs-grid?dT=true&startDate="+btoa(fromDate)+'&endDate='+btoa(toDate)+'&importedFrom='+btoa(importedFrom)+'&activeStatus='+btoa(subStatus))
//       .pipe(map((res:any) => {
//         return res;
//         // login successful if there's a jwt token in the response
//       }));
//   }


  partnerSubs(fromDate:any,toDate:any,search:any){
    return this.http.get<any>(this.baseURL+"api/Partner-subs-grid?dT=true&startDate="+btoa(fromDate)+'&endDate='+btoa(toDate))
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  activeSubs(fromDate:any,toDate:any,search:any){
    return this.http.get<any>(this.baseURL+"api/Active-subs-grid?dT=true&startDate="+btoa(fromDate)+'&endDate='+btoa(toDate))
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  bdSubs(fromDate:any,toDate:any,search:any){
    return this.http.get<any>(this.baseURL+"api/Bd-subs-grid?dT=true&startDate="+btoa(fromDate)+'&endDate='+btoa(toDate))
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  ownSubs(fromDate:any,toDate:any,search:any){
    return this.http.get<any>(this.baseURL+"api/Own-subs-grid?dT=true&startDate="+btoa(fromDate)+'&endDate='+btoa(toDate))
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  getCountries(){
    return this.http.get<any>(this.baseURL+'/getCountries')
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  store(artistObj: Object){
    return this.http.post<any>(this.baseURL+'/admin/sport/store', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  editSport(artistObj: Object){
    return this.http.put<any>(this.baseURL+'/admin/sport/update', artistObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  destroy(id: number){
    return this.http.delete<any>(this.baseURL+'/admin/sport/delete/' + id)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }
  searchStudents(term?: string) : Observable<any[]> {
    if (term && term.length>3) {

      const searchParam="search%5Bvalue%5D="+encodeURIComponent(term)+"&search%5Bregex%5D=false";
      return this.http.get<any>(`${this.baseURL}/user-grid?dT=true&autocomplete=true&${searchParam}`).pipe(map(rsp =>rsp.data));
    } else {
      return of([]);
    }
  }


}
