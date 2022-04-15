import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from './AppConstants';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = AppConstants.baseUrl;
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData,  {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }


  // delete file by id
  deleteFileById(id: string): Observable<Object> {
    return this.http.delete(`${this.baseUrl}` + '/files/' + `${id}`, httpOptions);
  }

   // delete file by id
   deleteFileByName(filename: string, id: string): Observable<Object> {
    return this.http.delete(`${this.baseUrl}` + '/files/upload/' + `${filename}/${id}`, httpOptions);
  }
/* 
  downfile(file: any): Observable<HttpEvent<any>>{

    const formData: FormData = new FormData();
    return this.http.post(`${this.baseUrl}/files` , formData, {
      responseType: "blob", reportProgress: true, observe: "events", headers: new HttpHeaders(
        { 'Content-Type': 'application/json' },
      )
    });
  } */
}