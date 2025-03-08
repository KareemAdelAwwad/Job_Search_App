import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseURL = `http://localhost:3000/auth/`; // BE server url
  token: any = `accesstoken_` + localStorage.getItem('token'); // token preparation for BE
  constructor(private _HttpClient: HttpClient, private _Router: Router) {
    this.token = `accesstoken_` + localStorage.getItem('token');
  }
  // http://localhost:3000/users/loginWithGmail
  loginWithGmail(data: any): Observable<any> {
    return this._HttpClient.post(this.baseURL + 'gmail-login', data); // call the BE loginWithGmail api
  }

  signUpWithGmail(data: any): Observable<any> {
    return this._HttpClient.post(this.baseURL + 'gmail-signup', data); // call the BE signUpWithGmail api
  }
}
