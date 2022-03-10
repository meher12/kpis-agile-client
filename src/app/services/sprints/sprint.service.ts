import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Sprint } from 'src/app/models/sprint.model';

const baseUrl = "http://localhost:8080/api/sprints";
const preferenceSource = new BehaviorSubject('Basic ref is required!');

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SprintService {



  constructor(private httpClient: HttpClient) { }

  // Sharing data between not related components:
  //private preferenceSource = new BehaviorSubject('Basic ref is required!');
  currentrefProject = preferenceSource.asObservable();

  changePReference(projectRef: string) {
    preferenceSource.next(projectRef)
  }

  // get AllSprints By ProjectId
  getAllSprintsByProjectId(projet_id: number): Observable<Sprint[]> {
    return this.httpClient.get<Sprint[]>(`${baseUrl}` + '/projects/' + `${projet_id}` + '/sprints', httpOptions);
  }

  // get AllSprints By ProjectId
  getAllSprints(): Observable<Sprint[]> {
    return this.httpClient.get<Sprint[]>(`${baseUrl}` + '/sprints/', httpOptions);
  }

  // get AllSprints By ProjectId
  getAllSprintsByProjectRef(project_ref: string): Observable<Sprint[]> {
    return this.httpClient.get<Sprint[]>(`${baseUrl}/${project_ref}` + '/sprints/', httpOptions);
  }

  // get sprint by id
  getSprintById(id: number): Observable<Sprint> {
    return this.httpClient.get<Sprint>(`${baseUrl}` + '/sprints/' + `${id}`, httpOptions);
  }

  // create new sprint
  createSprint(projetid: number, sprint: Sprint): Observable<Object> {
    return this.httpClient.post(`${baseUrl}` + "/projects/" + `${projetid}` + "/sprints", sprint, httpOptions);
  }

  // update sprint by id
  updateSprintById(id: number, sprint: Sprint): Observable<Object> {
    return this.httpClient.put(`${baseUrl}` + '/sprints/' + `${id}`, sprint, httpOptions);
  }

  // delete sprint by id
  deleteSprint(id: number): Observable<Object> {
    return this.httpClient.delete(`${baseUrl}` + '/sprints/' + `${id}`, httpOptions);
  }


  // delete project by id
  deleteAllSprintByProjectId(project_id: number): Observable<any> {
    return this.httpClient.delete(`${baseUrl}` + '/projects/' + `${project_id}` + '/sprints', httpOptions);
  }


}
