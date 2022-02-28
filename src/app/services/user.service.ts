import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


const API_URL = 'http://localhost:8080/api/test/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // get public content "/all"
  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  // get public content "/dev"
  getDevBoard(): Observable<any> {
    return this.http.get(API_URL + 'dev', { responseType: 'text' });
  }

   // get public content "/scm"
  getScrummBoard(): Observable<any> {
    return this.http.get(API_URL + 'scm', { responseType: 'text' });
  }

   // get public content "/po"
  getPoBoard(): Observable<any> {
    return this.http.get(API_URL + 'po', { responseType: 'text' });
  }

}