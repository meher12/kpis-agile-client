import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sprint } from 'src/app/models/sprint.model';

@Injectable({
  providedIn: 'root'
})
export class SprintService {

  private baseUrl = "http://localhost:8080/api/v1/sprints";

  constructor(private httpClient: HttpClient) { }

  // get all sprints
  getSprintList(): Observable<Sprint[]>{
    return this.httpClient.get<Sprint[]>(`${this.baseUrl}`);
  }

  // create new sprint
  createSprint(sprint: Sprint): Observable<Object>{
     return this.httpClient.post(`${this.baseUrl}`, sprint);
  }

  // get sprint by id
  getSprintById(id: number): Observable<Sprint>{
    return this.httpClient.get<Sprint>(`${this.baseUrl}/${id}`);
  }

  // update sprint by id
  updateSprint(id: number, sprint: Sprint): Observable<Object>{
     return this.httpClient.put(`${this.baseUrl}/${id}`, sprint);
  }

  // delete sprint
  deleteSprint(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

}
