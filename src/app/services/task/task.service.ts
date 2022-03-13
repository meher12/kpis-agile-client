import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { AppConstants } from '../AppConstants';


const sreferenceSource = new BehaviorSubject('Basic ref is required!');

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TaskService {

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

  // get All task By StoryId
  getAllTaskByStoryId(story_id: number): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.baseUrl}` + '/stories/' + `${story_id}` + '/tasks', httpOptions);
  }

  // get All Task
  getAllTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.baseUrl}` + '/tasks', httpOptions);
  }

  // get All Task By Story Ref
  getAllTaskByStoryRef(story_ref: string): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.baseUrl}/${story_ref}` + '/tasks', httpOptions);
  }

  // get task by id
  getTaskById(id: number): Observable<Task> {
    return this.httpClient.get<Task>(`${this.baseUrl}` + '/task/' + `${id}`, httpOptions);
  }

  // create new task
  createTask(storyid: number, task: Task): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}` + "/story/" + `${storyid}` + "/task", task, httpOptions);
  }

  // update task by id
  updateTaskById(id: number, task: Task): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}` + '/task/' + `${id}`, task, httpOptions);
  }

  // delete task by id
  deleteTask(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}` + '/task/' + `${id}`, httpOptions);
  }


  // delete all task by story id
  deleteAllTaskByStoryId(story_id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}` + '/story/' + `${story_id}` + '/tasks', httpOptions);
  }

}
