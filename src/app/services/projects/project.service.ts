import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable} from 'rxjs';

import { Projet } from 'src/app/models/projet.model';

const baseUrl = 'http://localhost:8080/api/projects';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient: HttpClient) { }

  // get all sprints
  getProjectList(): Observable<Projet[]> {
    return this.httpClient.get<Projet[]>(`${baseUrl}`, httpOptions);
  }

  // create new sprint
   createProject(project: Projet): Observable<Object> {
    return this.httpClient.post(`${baseUrl}`, project, httpOptions);
  }

  // get sprint by id
  getProjectById(id: number): Observable<Projet> {
    return this.httpClient.get<Projet>(`${baseUrl}/${id}`, httpOptions);
  }

  // update sprint by id
  updateProject(id: number, project: Projet): Observable<Object> {
    return this.httpClient.put(`${baseUrl}/${id}`, project, httpOptions);
  }

  // delete sprint
  deleteProject(id: number): Observable<Object> {
    return this.httpClient.delete(`${baseUrl}/${id}`, httpOptions);
  } 

}
