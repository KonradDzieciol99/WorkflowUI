import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IIcon } from '../models/IIcon';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  private iconsSource$:BehaviorSubject<IIcon[]>;
  public icons$:Observable<IIcon[]>;
  constructor(private http: HttpClient) {
    this.iconsSource$ = new BehaviorSubject([] as IIcon[]);
    this.icons$ = this.iconsSource$.asObservable();
  }

  getProjectsIcons (){
    return this.http.get<IIcon[]>(`${environment.photosServiceUrl}/getProjectsIcons`).pipe(
      tap(icons=>this.iconsSource$.next(icons))
    );
  }

}
