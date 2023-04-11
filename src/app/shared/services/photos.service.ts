import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IIcon } from '../models/IIcon';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  constructor(private http: HttpClient) {}
  
  getProjectsIcons (){
    return this.http.get<Array<IIcon>>(`${environment.photosServiceUrl}/getProjectsIcons`);
  }

}
