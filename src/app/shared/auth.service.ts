import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token = localStorage.getItem('token') || sessionStorage.getItem('token');
  constructor() {}
  isLoggedIn() {
    return this.token && this.token?.length > 0;
  }
  logIn(token: any) {
    this.token = token;
  }
}
