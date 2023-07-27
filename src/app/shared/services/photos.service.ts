import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IIcon } from '../models/IIcon';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  private iconsSource:BehaviorSubject<Array<IIcon>>;
  public icons$:Observable<Array<IIcon>>;
  constructor(private http: HttpClient) {
    this.iconsSource = new BehaviorSubject<Array<IIcon>>([]);
    this.icons$ = this.iconsSource.asObservable();
  }

  getProjectsIcons (){
    return this.http.get<Array<IIcon>>(`${environment.photosServiceUrl}/getProjectsIcons`).pipe(
      tap((icons=>{
        this.iconsSource.next(icons);
      }))
    );
  }

}
