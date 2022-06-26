import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstants } from './AppConstants';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class JacocoReportService {

 
  baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = AppConstants.baseUrl;
  }

  // get all report
  getReportList(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}` + '/reports/jcoverages', httpOptions);
  }

   // get  report by projectname
   getReportListByPName(projectname: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}` + '/reports/jcoverages/'+`${projectname}`, httpOptions);
  }


  // add new jacoco report
  createReport(report: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}` + '/reports/add', report, httpOptions);
  }

   // get  total coverage by projectname
   gettotalCoverageByPName(projectname: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}` + '/reports/projectcoverage/'+`${projectname}`, httpOptions);
  }

  deletereportByReportName(reportName: string): Observable<any>{
    return this.httpClient.delete(`${this.baseUrl}`+'/report/deleteallbyname/' + `${reportName}`, httpOptions);

  }
}
