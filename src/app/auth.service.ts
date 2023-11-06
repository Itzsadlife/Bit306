import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MerchantService } from './register.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isUserAuthenticated = new BehaviorSubject<boolean>(false);
  private isMerchantAuthenticated = new BehaviorSubject<boolean>(false);
  private isGuestMode = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private merchantService:MerchantService) {}
  
  userLogin(email: string, password: string) {
    this.isUserAuthenticated.next(true);
    this.isMerchantAuthenticated.next(false);
    this.isGuestMode.next(false);
    console.log(email);
    return this.http.post<{ message: string }>('http://localhost:3000/api/user/login', { email: email, password: password });
  }

  merchantLogin(email: string, password: string) {
    this.isMerchantAuthenticated.next(true);
    this.isUserAuthenticated.next(false);
    this.isGuestMode.next(false);
    return this.http.post<{message: string, _id: string}>('http://localhost:3000/api/merchant/login', { email: email, password: password }).pipe(
        tap(response => {
            this.merchantService.currentMerchantId = response._id;
        })
    );
}

Guest(){
  this.isGuestMode.next(true);
  this.isMerchantAuthenticated.next(false);
  this.isUserAuthenticated.next(false);
}

isUserLoggedIn() {
  return this.isUserAuthenticated.asObservable();
}
isMerchantLoggedIn() {
  return this.isMerchantAuthenticated.asObservable();
}
isGuestModeActive() {
  return this.isGuestMode.asObservable();
}
logout() {
  this.isUserAuthenticated.next(false);
  this.isMerchantAuthenticated.next(false);
}
getLoggedInMerchantId(): string {
    console.log('Getting merchant ID from authService:', this.merchantService.currentMerchantId);
    return this.merchantService.currentMerchantId;
}


}
