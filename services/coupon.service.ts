import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
      protected baseURL = `${environment.apiUrl}`;
  

  constructor(private http: HttpClient) {}

  getCoupons() {
    return this.http.get(`${this.baseURL}/all`);
  }
  getMasterclass () {
    return this.http.get(`${this.baseURL}/masterclass`);
  
}
 verifyCoupon (obj: any) {
    return this.http.post(`${this.baseURL}/verify-coupon`, obj);
}
createBulkOrder(purchases:any){
  return this.http.post(`${this.baseURL}/create-bulk-order`, purchases);
}
verifyOrder(data:any){
  return this.http.post(`${this.baseURL}/verify-bulk-order`, data);
}
 getDiscounts (data: { category_id: number; num_coupons: number }) {
  return this.http.post(`${this.baseURL}/reseller-discount-slab`,data);

}
getDiscountsList () {
  return this.http.get(`${this.baseURL}/reseller-discount-list`);

}
  getVideoCategories() {
    return this.http.get(`${this.baseURL}/video-categories`);
  }

  generateCoupons(data: { category_id: number; num_codes: number }) {
    return this.http.post(`${this.baseURL}/admin/generate-coupon-code`, data);
  }
  destroy(id: any) {
    return this.http.delete(`${this.baseURL}/admin/coupon-code/delete/`+ id);
  }
}
