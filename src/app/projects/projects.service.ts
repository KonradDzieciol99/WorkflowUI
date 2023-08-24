import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  DataSourceChangedEventArgs,
  DataStateChangeEventArgs,
} from '@syncfusion/ej2-angular-grids';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, map, mergeMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProject, isIProject } from '../shared/models/IProject';
import { IProjectCreateRequest } from '../shared/models/IProjectCreateRequest';
import { ISyncfusionFormat } from '../shared/models/ISyncfusionFormat';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  projectsUrl: string;
  private projectsSource$: BehaviorSubject<ISyncfusionFormat<IProject>>;
  public projects$: Observable<ISyncfusionFormat<IProject>>;
  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
  ) {
    this.projectsUrl = environment.projectsUrl;
    this.projectsSource$ = new BehaviorSubject({
      result: [],
      count: 0,
    } as ISyncfusionFormat<IProject>);
    this.projects$ = this.projectsSource$.asObservable();
  }
  public execute(state: DataStateChangeEventArgs): void {
    this.getData(state)
      .pipe(take(1))
      .subscribe((x) => {
        this.projectsSource$.next(x);
      });
  }
  protected getData(state: DataStateChangeEventArgs) {
    let params = new HttpParams();
    params = params.append('skip', state.skip?.toString() ?? 0);
    params = params.append('take', state.take?.toString() ?? 0);
    params = params.append(
      'search',
      state.search?.at(0)?.key?.toString() ?? '',
    );
    return this.http.get<ISyncfusionFormat<IProject>>(
      `${this.projectsUrl}/projects`,
      { params: params },
    );
  }
  createProject(projectCreateRequest: IProjectCreateRequest) {
    return this.http
      .post<IProject>(`${this.projectsUrl}/projects`, projectCreateRequest)
      .pipe(
        mergeMap((project) => {
          return this.projectsSource$.pipe(
            take(1),
            tap((projects) => {
              const newData: ISyncfusionFormat<IProject> = {
                result: [...projects.result],
                count: projects.count,
              };

              newData.result.push(project);
              newData.count = newData.count + 1;

              this.projectsSource$.next(newData);
            }),
            map(() => project),
          );
        }),
      );
  }

  deleteProject(state: DataSourceChangedEventArgs) {
    let id = '';

    if (
      Array.isArray(state.data) &&
      state.data.length > 0 &&
      isIProject(state.data[0])
    )
      id = state.data[0].id;
    else throw new Error('Error occured');

    return this.http.delete<void>(`${this.projectsUrl}/projects/${id}`);
  }
  acceptProjectInvitation(projectId: string) {
    return this.http.put<void>(
      `${this.projectsUrl}/Projects/${projectId}/AcceptInvitation`,
      {},
    );
  }
  declineProjectInvitation(projectId: string) {
    return this.http.delete<void>(
      `${this.projectsUrl}/Projects/${projectId}/DeclineInvitation`,
    );
  }
}
