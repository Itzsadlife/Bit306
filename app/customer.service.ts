import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './users.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private user: User[] = [];
  private baseUrl = 'http://localhost:3000/api'; 
  constructor(private http: HttpClient) { }

  addCustomer(firstName: string, lastName: string, email: string, contactNumber: string, password: string): Observable<any> {
    const user: User = {
      _id: null,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      contactNumber: contactNumber,
    };

    return this.http.post(`${this.baseUrl}/users/register`, user);
  }

}
