import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPerson } from '../shared/models/IPerson';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient,) { 

  }
  getListsOfpeople(){
    return this.http.get<Array<IPerson>>(this.baseUrl + 'account/refresh-token');
  }



}
