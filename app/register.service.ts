import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Merchant } from "./register.model";
import { HttpService } from './http.service';


@Injectable({ providedIn: 'root' })
export class MerchantService {

  private merchants: Merchant[] = [];
  private baseUrl = 'http://localhost:3000/api'; 
  private _currentMerchantId: string;

  constructor(private http: HttpClient, private HttpService: HttpService) { }

  getMerchants(): Observable<Merchant[]> {
    return this.http.get<Merchant[]>(`${this.baseUrl}/merchants`);
  }

  addMerchant(firstName: string, lastName: string, email: string, contactNumber: string, description: string, password: string, isFirstLogin: boolean): Observable<any> {
    const merchant: Merchant = {
      _id: null,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      contactNumber: contactNumber,
      description: description,
      status: 'Pending',
      isFirstLogin: true,

    };
    
    this.HttpService.sendEmail("http://localhost:3000/api/register/sendmail",merchant).subscribe(
      data=>{
        let res:any=data;
      }
    );

    return this.http.post(`${this.baseUrl}/merchants/register`, merchant);
  }

  updateStatus(_id: string, status: string) {
    return this.http.patch(`http://localhost:3000/api/merchants/${_id}`, { status: status });
}

  getMerchantDetails(merchantId: string): Observable<Merchant> {
    return this.http.get<Merchant>(`${this.baseUrl}/merchants/${merchantId}`);
  }


  changePassword(merchantId: string, newPassword: string) {
    console.log("register.service",merchantId);
    return this.http.post('http://localhost:3000/api/change-password/merchants', { id: merchantId, newPassword: newPassword });
}


  // OR using a simple method
  getAllMerchants() {
    return [...this.merchants];
  }

  set currentMerchantId(id: string) {
    this._currentMerchantId = id;
  }
  
  get currentMerchantId(): string {
    return this._currentMerchantId;
  }

}
