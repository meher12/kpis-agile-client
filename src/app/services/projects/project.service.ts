import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Projet } from 'src/app/models/projet.model';
import { AppConstants } from '../AppConstants';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = AppConstants.baseUrl;
  }

  // get all project
  getProjectList(): Observable<Projet[]> {
    return this.httpClient.get<Projet[]>(`${this.baseUrl}` + '/projects/', httpOptions);
  }

  // create new project
  createProject(project: Projet): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}` + '/projects/', project, httpOptions);
  }

  // get project by id
  getProjectById(id: number): Observable<Projet> {
    return this.httpClient.get<Projet>(`${this.baseUrl}` + '/projects/' + `${id}`, httpOptions);
  }

  // get project by reference
  getProjectByReference(preference: string): Observable<Projet> {
    return this.httpClient.get<Projet>(`${this.baseUrl}` + '/projects/' + `${preference}/`, httpOptions);
  }

  // update project by id
  updateProject(id: number, project: Projet): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}` + '/projects/' + `${id}`, project, httpOptions);
  }

  // delete project by id
  deleteProject(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}` + '/projects/' + `${id}`, httpOptions);
  }

  // delete project by id
  deleteAllProjects(): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}`+'/projects/', httpOptions);
  }

  // percentage sp by project 
   percentageSpCByproject(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}`+'/projects/percentageSpcChart', httpOptions);
  }

  // releasebdchart project by id
  releasebdchart(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}`+'/projects/releasebdchart', httpOptions);
  }

  // updateStoryPointsInproject
 /*  updateStoryPointsInproject(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}`+'/projects/sumspbyproject', httpOptions);
  } */
}


