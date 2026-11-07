import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({providedIn:'root'})
export class ApiService {
  private base='/api';
  constructor(private http:HttpClient){}
  private opts(){const t=localStorage.getItem('token');return {headers:new HttpHeaders(t?{Authorization:`Bearer ${t}`}:{})};}
  login(data:any){return this.http.post<any>(`${this.base}/auth/login`,data);}
  get(path:string):Observable<any>{return this.http.get<any>(`${this.base}${path}`,this.opts());}
  post(path:string,data:any):Observable<any>{return this.http.post<any>(`${this.base}${path}`,data,this.opts());}
  put(path:string,data:any):Observable<any>{return this.http.put<any>(`${this.base}${path}`,data,this.opts());}
  delete(path:string):Observable<any>{return this.http.delete<any>(`${this.base}${path}`,this.opts());}
}
