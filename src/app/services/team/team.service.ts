import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../AppConstants';
import { Observable } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  baseUrl: string;

  constructor(private httpClient: HttpClient) { 
    this.baseUrl = AppConstants.baseUrl;
  }

  //get all team
  getAllTeam(): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.baseUrl}` + "/auth/users/", httpOptions);
  }

   // get user by id
   getUserById(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}` + '/auth/users/' + `${id}`, httpOptions);
  }

  // update user
  updateUser(id: number, user: any): Observable<any>{
    return this.httpClient.put<any>(`${this.baseUrl}` + "/auth/updateUser/" + `${id}`, user, httpOptions );
  }

  // delete user
  deleteUser(id: number): Observable<any>{
    return this.httpClient.delete(`${this.baseUrl}` + "/auth/deleteUser/" +`${id}`, httpOptions);
  }

  // delete AllUsers
  deleteAllUser(): Observable<any>{
    return this.httpClient.delete(`${this.baseUrl}` + "/auth/deleteAllUser/", httpOptions);
  }
}
