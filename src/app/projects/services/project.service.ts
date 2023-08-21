import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tab } from '@syncfusion/ej2-angular-grids';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  concatMap,
  filter,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { INotification } from 'src/app/shared/models/INotification';
import { IProject } from 'src/app/shared/models/IProject';
import { IProjectMember } from 'src/app/shared/models/IProjectMember';
import { ISearchedMember } from 'src/app/shared/models/ISearchedMember';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  aggregatorUrl: string;
  projectsUrl: string;
  private projectSource: BehaviorSubject<IProject | undefined>;
  project$: Observable<IProject | undefined>;

  constructor(private http: HttpClient, private router: Router) {
    this.projectsUrl = environment.projectsUrl;
    this.aggregatorUrl = environment.aggregator;
    this.projectSource = new BehaviorSubject<IProject | undefined>(undefined);
    this.project$ = this.projectSource.asObservable();
  }
  get(projectId: string) {
    return this.http
      .get<IProject>(`${this.projectsUrl}/projects/${projectId}`)
      .pipe(tap((project) => this.projectSource.next(project)));
  }
  update(updateProject: {
    name?: string;
    iconUrl?: string;
    newLeaderId?: string;
    projectId: string;
  }) {
    return this.http.put(
      `${this.projectsUrl}/projects/${updateProject.projectId}`,
      updateProject
    );
  }
  findMemberByEmailAndCheckState(email: string) {
    return this.project$.pipe(
      filter((project): project is IProject => project !== undefined),
      switchMap((project) => {
        const params = new HttpParams().set('projectId', project.id);

        return this.http.get<Array<ISearchedMember>>(`${this.aggregatorUrl}/Identity/searchMember/${email}`,{ params: params });
      })
    );
  }
  addMember(email: string) {
    return this.project$.pipe(
      take(1),
      filter((project): project is IProject => project !== undefined),
      switchMap((project) => {
        return this.http.post<IProjectMember>(`${this.aggregatorUrl}/Projects/${project.id}/projectMembers/${email}`,{}).pipe(
          take(1),
          map(newMember =>{ 
            let updatedProject: IProject = {...project, projectMembers: [...project.projectMembers, newMember ]};
            return updatedProject;
          }))
      }),
      tap((updatedProject)=>{
        this.projectSource.next(updatedProject)
      })
    );
  }
  deleteMember(id: string) {
    return this.project$.pipe(
      take(1),
      filter((project): project is IProject => project !== undefined),
      switchMap((project) => {
        return this.http.delete<void>(`${this.projectsUrl}/Projects/${project.id}/projectMembers/${id}`).pipe(
          take(1),
          map(() =>{ 
            let updatedProject: IProject = {
              ...project, 
              projectMembers: project.projectMembers.filter(p=>p.id !==id)
            };
            return updatedProject;
          }));
      }),
      tap((updatedProject)=>{
        this.projectSource.next(updatedProject)
      })
    );
  }

}
