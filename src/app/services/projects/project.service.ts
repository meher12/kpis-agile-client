import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Projet } from 'src/app/models/projet.model';
import { Sprint } from 'src/app/models/sprint.model';
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
    return this.httpClient.delete(`${this.baseUrl}` + '/projects/', httpOptions);
  }

  //update all story points
  updateAllSp(): Observable<Object> {
    return this.httpClient.get<any>(`${this.baseUrl}` + '/projects/updateallsp', httpOptions);
  }
  // percentage sp by project 
  percentageSpCByproject(preference: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}` + '/projects/percentageSpcChart/' + `${preference}`, httpOptions);
  }

  // productbdchart project by preference
  getProductBurndownChart(pReference: string): Observable<any> {

    const myObject: any = {pReference /* , that: 'thatThing', other: 'otherThing' */ };
    const httpParams: HttpParamsOptions = { fromObject: myObject } as HttpParamsOptions;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpOptionsWithParams = { params: new HttpParams(httpParams), headers: headers };
   
    return this.httpClient.get(`${this.baseUrl}` + '/projects/productbdchart', httpOptionsWithParams);
  }

  // releasebdchart project by preference
  releasebdchart(pReference: string): Observable<any> {

    const myParams: any = {pReference /* , that: 'thatThing', other: 'otherThing' */ };
    const httpParams: HttpParamsOptions = { fromObject: myParams } as HttpParamsOptions;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpOptionsWithParams = { params: new HttpParams(httpParams), headers: headers };

    return this.httpClient.get(`${this.baseUrl}` + '/projects/releasebdchart', httpOptionsWithParams);
  }

  // task status percentage chart by project  preference
  getListtaskByStatus(preference: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}` + '/projects/percentTaskStatuscChart/' + `${preference}`, httpOptions);
  }

  // select tdate_debut in task by project ref
  getListTaskStartDateBypRef(preference: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}` + '/projects/listStartDateTask/' + `${preference}`, httpOptions);
  }

  // task status chart by project  preference
  getEfficacityByStartDateTask(preference: string, startDateObject: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}` + '/projects/getEfficacity/' + `${preference}`, startDateObject, httpOptions);
  }

  //  select work completed in task by project reference
  getPercentageStoryPointsInProject(preference: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}` + '/projects/percentageStoryPointsInProject/' + `${preference}`, httpOptions);
  }


  // task status chart by project  preference
  getTaskBugsByStartDateTask(preference: string, startDateObject: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}` + '/projects/gettaskbugs/' + `${preference}`, startDateObject, httpOptions);
  }

  // add, update memeber
  addUpdateteamMember(id: number, teamMember: any): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}` + '/project/addmember/' + `${id}`, teamMember, httpOptions);
  }

  // find sprint by project title
  findSprintByProjectReference(projectReference: any): Observable<Sprint[]> {
    return this.httpClient.get<Sprint[]>(`${this.baseUrl}`+ "/projects/searchByPReference"+`?projectReference=${projectReference}`);
  }
  
  // find project by title
  // find sprint by project title
 /*  findProjectTitle(title: any): Observable<Projet> {
    return this.httpClient.get<Projet>(`${this.baseUrl}`+ "/findProjects"+`?title=${title}`);
  } */
}


