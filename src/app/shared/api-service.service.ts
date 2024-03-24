import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import config from '../../assets/config.json';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  newPatientData = new BehaviorSubject<any>("");
  baseUrl: string = '';
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {
    this.baseUrl = config.baseURL;
  }

  login(params: any) {
    return this.http.post(`${this.baseUrl}auth/login`, params, { headers: this.headers });
  }
  addPatient(params: any) {
    return this.http.post(`${this.baseUrl}users/add`, params, { headers: this.headers });
  }
}
