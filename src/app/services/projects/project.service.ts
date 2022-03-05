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

  // get all project
  getProjectList(): Observable<Projet[]> {
    return this.httpClient.get<Projet[]>(`${baseUrl}`, httpOptions);
  }

  // create new project
   createProject(project: Projet): Observable<Object> {
    return this.httpClient.post(`${baseUrl}`, project, httpOptions);
  }

  // get project by id
  getProjectById(id: number): Observable<Projet> {
    return this.httpClient.get<Projet>(`${baseUrl}/${id}`, httpOptions);
  }

  // update project by id
  updateProject(id: number, project: Projet): Observable<Object> {
    return this.httpClient.put(`${baseUrl}/${id}`, project, httpOptions);
  }

  // delete project by id
  deleteProject(id: number): Observable<Object> {
    return this.httpClient.delete(`${baseUrl}/${id}`, httpOptions);
  } 

   // delete project by id
   deleteAllProjects(): Observable<any> {
    return this.httpClient.delete(`${baseUrl}`,  httpOptions);
  } 

}
