import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PTask } from '../models/PTask.model';

@Injectable({
  providedIn: 'root'
})
export class PTaskService {

  constructor(private http: HttpClient) { }

  GetAllByTeamId(id:number) {
    return this.http.get<PTask[]>('api/PTasks/GetAllByTeamId'+id);
  }
  
}
