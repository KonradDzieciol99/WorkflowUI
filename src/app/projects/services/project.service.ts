import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { IProject } from 'src/app/shared/models/IProject';
import { IProjectMember, ProjectMemberType } from 'src/app/shared/models/IProjectMember';
import { ISearchedMember } from 'src/app/shared/models/ISearchedMember';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectSource$: BehaviorSubject<IProject | undefined>;
  project$: Observable<IProject | undefined>;
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.baseUrl = `${environment.WorkflowUrl}/projects`;

    this.projectSource$ = new BehaviorSubject(
      undefined as IProject | undefined,
    );
    this.project$ = this.projectSource$.asObservable();
  }
  get(projectId: string) {
    return this.http
      .get<IProject>(`${this.baseUrl}/api/projects/${projectId}`)
      .pipe(tap((project) => this.projectSource$.next(project)));
  }
  update(updatedProjectCommand: {
    name: string;
    iconUrl: string;
    newLeaderId: string;
    projectId: string;
  }) {
    return this.http.put<IProject>(`${this.baseUrl}/api/projects/${updatedProjectCommand.projectId}`,updatedProjectCommand)
                    .pipe(
                      tap(updatedProject=>this.projectSource$.next(updatedProject)),       
                    );
  }
  findMemberByEmailAndCheckState(email: string,
                                isScroll:boolean,
                                takeAmount = 20,) {
    return this.project$.pipe(
      filter((project): project is IProject => project !== undefined),
      switchMap((project) => {

        let params = new HttpParams().set('projectId', project.id);
        //TODO
        //params = params.append('Skip', isScroll ? currentConfirmedInvitations.length.toString() : "0");
        params = params.append('Take', takeAmount.toString());
        params = params.append('Skip', "0");

        return this.http.get<ISearchedMember[]>(
          `${environment.WorkflowUrl}/aggregator/api/Projects/${project.id}/projectMembers/SearchProjectMember/${email}`,
          { params: params },
        );
      }),
    );
  }
  addMember(email: string) {
    return this.project$.pipe(
      take(1),
      filter((project): project is IProject => project !== undefined),
      switchMap((project) => {
        return this.http
          .post<IProjectMember>(
            `${environment.WorkflowUrl}/aggregator/api/Projects/${project.id}/projectMembers/${email}`,
            {},
          )
          .pipe(
            take(1),
            map((newMember) => {
              const updatedProject: IProject = {
                ...project,
                projectMembers: [...project.projectMembers, newMember],
              };
              return updatedProject;
            }),
          );
      }),
      tap((updatedProject) => {
        this.projectSource$.next(updatedProject);
      }),
    );
  }
  deleteMember(id: string) {
    return this.project$.pipe(
      take(1),
      filter((project): project is IProject => project !== undefined),
      switchMap((project) => {
        return this.http
          .delete<void>(
            `${this.baseUrl}/api/Projects/${project.id}/projectMembers/${id}`,
          )
          .pipe(
            take(1),
            map(() => {
              const updatedProject: IProject = {
                ...project,
                projectMembers: project.projectMembers.filter(
                  (p) => p.id !== id,
                ),
              };
              return updatedProject;
            }),
          );
      }),
      tap((updatedProject) => {
        this.projectSource$.next(updatedProject);
      }),
    );
  }
  public setProjectSource(project:IProject){
    this.projectSource$.next(project);
  }

}
