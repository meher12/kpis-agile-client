import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Story } from 'src/app/models/story.model';
import { AppConstants } from '../AppConstants';



const sreferenceSource = new BehaviorSubject('Basic ref is required!');

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = AppConstants.baseUrl;
  }

  // Sharing data between not related components:
  //private preferenceSource = new BehaviorSubject('Basic ref is required!');
  currentrefSprint = sreferenceSource.asObservable();

  changeSReference(sprintRef: string) {
    sreferenceSource.next(sprintRef)
  }

  // get All Story By SprintId
  getAllStoryBySprintId(sprint_id: number): Observable<Story[]> {
    return this.httpClient.get<Story[]>(`${this.baseUrl}` + '/sprints/' + `${sprint_id}` + '/stories', httpOptions);
  }

  // get All Story
  getAllStory(): Observable<Story[]> {
    return this.httpClient.get<Story[]>(`${this.baseUrl}` + '/stories', httpOptions);
  }

  // get All Story By Sprint Ref
  getAllStoryBySprintRef(sprint_ref: string): Observable<Story[]> {
    return this.httpClient.get<Story[]>(`${this.baseUrl}/${sprint_ref}` + '/stories', httpOptions);
  }

  // get story by id
  getStoryById(id: number): Observable<Story> {
    return this.httpClient.get<Story>(`${this.baseUrl}` + '/story/' + `${id}`, httpOptions);
  }

  // create new story
  createStory(sprintid: number, story: Story): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}` + "/sprints/" + `${sprintid}` + "/story", story, httpOptions);
  }

  // update story by id
  updateStoryById(id: number, story: Story): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}` + '/story/' + `${id}`, story, httpOptions);
  }

  // delete story by id
  deleteStory(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}` + '/story/' + `${id}`, httpOptions);
  }


  // delete all story by sprint id
  deleteAllStoryBySprintId(sprint_id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}` + '/sprints/' + `${sprint_id}` + '/stories', httpOptions);
  }

}
