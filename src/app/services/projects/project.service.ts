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

  //private baseUrl = "http://localhost:8080/api/projets";
  constructor(private httpClient: HttpClient) { }

  // get all sprints
  getProjectList(): Observable<Projet[]> {
    return this.httpClient.get<Projet[]>(`${baseUrl}` + '/projects', httpOptions);
  }

  // create new sprint
   createProject(project: Projet): Observable<any> {
    return this.httpClient.post(`${baseUrl}` + '/projects', project, httpOptions);
  }
/*
  // get sprint by id
  getProjectById(id: number): Observable<Projet> {
    return this.httpClient.get<Projet>(`${this.baseUrl}/${id}`);
  }

  // update sprint by id
  updateProject(id: number, project: Projet): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, project);
  }

  // delete sprint
  deleteProject(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  } */

}
