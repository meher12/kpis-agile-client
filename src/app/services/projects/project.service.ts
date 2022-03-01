import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Projet } from 'src/app/models/projet.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseUrl = "http://localhost:8080/api/projets";
  constructor(private httpClient: HttpClient) { }

  // get all sprints
  getProjectList(): Observable<Projet[]> {
    return this.httpClient.get<Projet[]>(`${this.baseUrl}`).pipe(catchError(this.handleError));
  }

  // create new sprint
  createProject(project: Projet): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, project).pipe(catchError(this.handleError));
  }

  // get sprint by id
  getProjectById(id: number): Observable<Projet> {
    return this.httpClient.get<Projet>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  // update sprint by id
  updateProject(id: number, project: Projet): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, project).pipe(catchError(this.handleError));
  }

  // delete sprint
  deleteProject(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(httpError: HttpErrorResponse) {
    if (httpError.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', httpError.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${httpError.status}, ` + `body was: ${httpError.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }

}
