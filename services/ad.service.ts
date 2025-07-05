import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdService {
      protected baseURL = `${environment.apiUrl}`;
  

  constructor(private http: HttpClient) {}

  storeSettings(data: any) {
    return this.http.post(`${this.baseURL}/admin/settings/store`, data);
  }
  updateSettings(data: any) {
    return this.http.put(`${this.baseURL}/admin/settings/update`, data);
  }
  getSettings() {
    return this.http.get(`${this.baseURL}/admin/settings/edit/1`);
  }
  UPDATE(data: any) {
    return this.http.put(`${this.baseURL}/admin/ad/update`, data);
  }

  store(data: any) {
    return this.http.post(`${this.baseURL}/admin/ad/store`, data);
  }
  destroy(id: any) {
    return this.http.delete(`${this.baseURL}/admin/ad/delete/`+ id);
  }
}
