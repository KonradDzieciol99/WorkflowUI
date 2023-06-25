import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IProject } from 'src/app/shared/models/IProject';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projectsUrl = environment.projectsUrl;

  constructor(private http: HttpClient,private router: Router) {}

  private projectSource:BehaviorSubject<IProject|undefined> = new BehaviorSubject<IProject|undefined>(undefined);
  project$:Observable<IProject|undefined>=this.projectSource.asObservable()
  get(name:string){
    return this.http.get<IProject>(`${this.projectsUrl}/projects/${name}`).pipe(
      tap(project=>this.projectSource.next(project)),
    );
  }
}
