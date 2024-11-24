import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
url = environment.apiUrl;

  constructor(private httpClient:HttpClient) { }


  add(data:any){
    return this.httpClient.post(this.url+
      "/material/add/",data,{
        headers:new HttpHeaders().set('content-Type',"application/json")
      }
    )
  }
  update(data:any){
    return this.httpClient.patch(this.url+
      "/material/update/",data,{
        headers:new HttpHeaders().set('content-Type',"application/json")
      }
    )
  }
  getProducts(){
    return this.httpClient.get(this.url + "/material/get/");
  }
  updateStatus(data:any){
    return this.httpClient.patch(this.url+
      "/material/updatestatus/",data,{
        headers:new HttpHeaders().set('content-Type',"application/json")
      }
    )
  }
  delete(id:any){
    return this.httpClient.delete(this.url+
      "/material/delete/"+id,{
        headers:new HttpHeaders().set('content-Type',"application/json")
      }
    )
  }
  getProductsByCategory(id:any){
    return this.httpClient.get(this.url +"/material/getByfamille/" + id);
  }
  getById(id:any) {
    return this.httpClient.get(this.url +"/material/getById/" + id);
  }
}
