import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BackendLoginService {
protected baseURL = `${environment.apiUrl}`;


  constructor(private http: HttpClient) { }
  store(artistObj: Object) {
    return this.http.post<any>(this.baseURL + '/admin/backend-user/store', artistObj)
      .pipe(
        map((res: any) => {
          console.log('API Response:', res);
  
          // Check if success is false and manually throw an error
          if (!res.success) {
            throw new Error(res.error || 'Unknown error occurred.');
          }
  
          return res;
        }),
        catchError((error: any) => {
          console.error('HTTP Error:', error.error);
          return throwError(() => error.error);
        })
      );
  }
  
    update(artistObj: Object) {
      // console.log('Request payload:', artistObj); // Log the request payload
    
      return this.http
        .put<any>(this.baseURL + '/admin/backend-user/update', artistObj)
        .pipe(
          map((res: any) => {
            console.log('HTTP Response:', res); // Log the successful response
            return res; // Return the response for further processing
          }),
          catchError((error: any) => {
            // Check and log if the error object contains an 'error' field
            if (error.error && Array.isArray(error.error)) {
              console.error('Error Details:', error.error); // Log the detailed error message
            } else {
              console.error('Unexpected Error:', error); // Fallback for unexpected errors
            }
    
            return throwError(() => error); // Re-throw the error for further handling
          })
        );
    }
    
    
        edit(id: number){
      return this.http.get<any>(this.baseURL+'/admin/backend-user/edit/'+ id)
        .pipe(map((res:any) => {
          // console.log('res----------------------',res)
          return res;
          // login successful if there's a jwt token in the response
        }));
    }
    delete(id: number){
      return this.http.delete<any>(this.baseURL+'/admin/backend-user/delete/'+id)
        .pipe(map((res:any) => {
          console.log('res----------------------',res)
          return res;
          // login successful if there's a jwt token in the response
        }));
    }
    changePassword(obj: Object){
      return this.http.put<any>(this.baseURL+'/admin/backend-user/change-password', obj)
        .pipe(map((res:any) => {
          console.log('res----------------------',res)
          return res;
          // login successful if there's a jwt token in the response
        }));
    }
}
