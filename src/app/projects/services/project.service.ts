import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tab } from '@syncfusion/ej2-angular-grids';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { IProject } from 'src/app/shared/models/IProject';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  projectsUrl = environment.projectsUrl;
  private projectSource:BehaviorSubject<IProject|undefined>;
  project$:Observable<IProject|undefined>;
  constructor(private http: HttpClient,private router: Router) {
    this.projectsUrl = environment.projectsUrl;
    this.projectSource = new BehaviorSubject<IProject|undefined>(undefined);
    this.project$ = this.projectSource.asObservable()
  }
  get(projectId:string){
    return this.http.get<IProject>(`${this.projectsUrl}/projects/${projectId}`).pipe(
      tap(project=>this.projectSource.next(project)),
    );
  }
  update(updateProject:{name?:string ,iconUrl?:string ,newLeaderId?:string,projectId:string }){
    return this.http.put(`${this.projectsUrl}/projects/${updateProject.projectId}`,updateProject);
  }
}
