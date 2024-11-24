import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  generateReport(data: any): Observable<any> {
    return this.httpClient.post(this.url +
      "/ticket/generateReport/",data,{
        headers: new HttpHeaders().set('Content-Type',"application/json")
      }).pipe(
      catchError(error => {
        console.error('Error generating report:', error);
        return throwError(error); // rethrow the error after logging it
      })
    );
  }

  getPdf(data: any): Observable<Blob> {
    return this.httpClient.post(this.url + "/ticket/getPdf/", data, { responseType: 'blob' });
  }
  getBills(){
    return this.httpClient.get(this.url+"/ticket/getTicket/");
  }
  delete(id:any){
    return this.httpClient.delete(this.url+"/ticket/delete/"+id,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    })
  }
}

