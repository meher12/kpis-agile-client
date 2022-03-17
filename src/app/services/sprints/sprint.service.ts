import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Sprint } from 'src/app/models/sprint.model';
import { AppConstants } from '../AppConstants';


const preferenceSource = new BehaviorSubject('Basic ref is required!');

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SprintService {

  baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = AppConstants.baseUrl;
  }

  // Sharing data between not related components:
  //private preferenceSource = new BehaviorSubject('Basic ref is required!');
  currentrefProject = preferenceSource.asObservable();

  changePReference(projectRef: string) {
    preferenceSource.next(projectRef)
  }

  // get AllSprints By ProjectId
  getAllSprintsByProjectId(projet_id: number): Observable<Sprint[]> {
    return this.httpClient.get<Sprint[]>(`${this.baseUrl}` + '/sprints/projects/' + `${projet_id}` + '/sprints', httpOptions);
  }

  // get AllSprints
  getAllSprints(): Observable<Sprint[]> {
    return this.httpClient.get<Sprint[]>(`${this.baseUrl}` + '/sprints/sprints', httpOptions);
  }

  // get AllSprints By ProjectId
  getAllSprintsByProjectRef(project_ref: string): Observable<Sprint[]> {
    return this.httpClient.get<Sprint[]>(`${this.baseUrl}` + '/sprints/' + `${project_ref}` + '/sprints', httpOptions);
  }

  // get sprint by id
  getSprintById(id: number): Observable<Sprint> {
    return this.httpClient.get<Sprint>(`${this.baseUrl}` + '/sprints/sprints/' + `${id}`, httpOptions);
  }

  // get project by reference
  getSprintByReference(sreference: string): Observable<Sprint> {
    return this.httpClient.get<Sprint>(`${this.baseUrl}` + '/sprints/' + `${sreference}/`, httpOptions);
  }

  // create new sprint
  createSprint(projetid: number, sprint: Sprint): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}` + "/sprints/projects/" + `${projetid}` + "/sprints", sprint, httpOptions);
  }

  // update sprint by id
  updateSprintById(id: number, sprint: Sprint): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}` + '/sprints/sprints/' + `${id}`, sprint, httpOptions);
  }

  // delete sprint by id
  deleteSprint(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}` + '/sprints/sprints/' + `${id}`, httpOptions);
  }


  // delete all sprint by project id
  deleteAllSprintByProjectId(project_id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}` + '/sprints/projects/' + `${project_id}` + '/sprints', httpOptions);
  }

  // update work Commitment and work Completed in sprint
  updateStoryPointInSprint(): Observable<Sprint[]> {
    return this.httpClient.get<Sprint[]>(`${this.baseUrl}` + '/sprints/updatesp', httpOptions);
  }



}
