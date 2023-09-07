import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { BehaviorSubject, Observable, filter, map, mergeMap, take, tap } from 'rxjs';
import { IProject } from 'src/app/shared/models/IProject';
import { IProjectMember, ProjectMemberType } from 'src/app/shared/models/IProjectMember';
import { ISyncfusionFormat } from 'src/app/shared/models/ISyncfusionFormat';
import { environment } from 'src/environments/environment';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectMembersService {
  //private baseUrl: string;
  
  private projectMemberSource$: BehaviorSubject<
    ISyncfusionFormat<IProjectMember>
  >;
  public projectMember$: Observable<ISyncfusionFormat<IProjectMember>>;
  lastState?: DataStateChangeEventArgs;
  baseUrl: string;
  constructor(
    private http: HttpClient,
    private projectService: ProjectService,
  ) {
    this.baseUrl = `${environment.WorkflowUrl}/projects`;

    this.projectMemberSource$ = new BehaviorSubject({
      result: [],
      count: 0,
    } as ISyncfusionFormat<IProjectMember>);
    this.projectMember$ = this.projectMemberSource$.asObservable();
  }
  public execute(state: DataStateChangeEventArgs) {
    this.lastState = state;
    return this.get(state).pipe(
      tap((members) => this.projectMemberSource$.next(members)),
    );
  }
  private get(state: DataStateChangeEventArgs) {
    const searchTerm = state.search?.at(0)?.key?.toString() ?? '';
    const skip = state.skip?.toString() ?? 0;
    const take = state.take?.toString() ?? 10;

    return this.projectService.project$.pipe(
      filter((project): project is IProject => project !== undefined),
      map((p) => p.projectMembers),
      map((members) => {
        if (searchTerm)
          members = members.filter((m) =>
            m.userEmail.toLowerCase().startsWith(searchTerm.toLowerCase()),
          );

        const result: ISyncfusionFormat<IProjectMember> = {
          result: members.slice(Number(skip), Number(skip) + Number(take)),
          count: members.length,
        };

        return result;
      }),
    );
  }
  updateMember(memberId:string,updateMemberCommand:{type:ProjectMemberType,projectId:string,userId:string}){
    
    return this.projectService.project$.pipe(
      take(1),
      filter((project): project is IProject => project !== undefined),
      mergeMap((project) => {
        return this.http
          .put<void>( `${this.baseUrl}/api/Projects/${project.id}/projectMembers/${memberId}`,updateMemberCommand)
          .pipe(
            take(1),
            map(() => {

              const updatedProject: IProject = {
                ...project,
                projectMembers : project.projectMembers.map((member) =>{
                 let test= member.id === memberId ? { ...member, type: updateMemberCommand.type, } : member
                 return test;
                }
                )
              };

              return updatedProject;
            }),
          );
      }),
      tap((updatedProject) => {
        this.projectService.setProjectSource(updatedProject);

        if (this.lastState) {
          this.execute(this.lastState).pipe(take(1)).subscribe();
        }
        
      }),
    );  
  }
  // delete(state: DataSourceChangedEventArgs){

  //   let id = '' ;

  //   if (Array.isArray(state.data) && state.data.length > 0 && isIProject(state.data[0]))
  //     id = state.data[0].id;
  //   else
  //     throw new Error("Error occured")

  //   // let id ='';
  //   // if (Array.isArray(state.data))
  //   //   id=state.data[0].id;
  //   // else
  //   //   this.toastrService.error("Error occured")

  //   return this.projectService.project$.pipe(
  //     filter((project): project is IProject  => project !== undefined),
  //     concatMap(project=>this.http.delete<void>(`${this.baseUrl}/projects/${project.id}/task/${id}`))
  //   )

  // }
}
