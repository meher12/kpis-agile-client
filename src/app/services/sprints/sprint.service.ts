import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sprint } from 'src/app/models/sprint.model';

@Injectable({
  providedIn: 'root'
})
export class SprintService {

  private baseUrl = "http://localhost:8080/api/v1/employees";

  constructor(private httpClient: HttpClient) { }

  getSprintList(): Observable<Sprint[]>{
    return
  }
}
