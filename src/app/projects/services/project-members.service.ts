import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataSourceChangedEventArgs, DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { IProject } from 'src/app/shared/models/IProject';
import { IProjectMember } from 'src/app/shared/models/IProjectMember';
import { ISyncfusionFormat } from 'src/app/shared/models/ISyncfusionFormat';
import { environment } from 'src/environments/environment';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectMembersService {
  private projectId?: string;
  private baseUrl:string;
  private projectMemberSource$:BehaviorSubject<ISyncfusionFormat<IProjectMember>>;
  public projectMember$:Observable<ISyncfusionFormat<IProjectMember>>;
  constructor(private http: HttpClient,private toastrService:ToastrService,private projectService:ProjectService) {
    this.baseUrl = environment.tasksUrl;
    this.projectMemberSource$ = new BehaviorSubject<ISyncfusionFormat<IProjectMember>>({result: [], count: 0});
    this.projectMember$ = this.projectMemberSource$.asObservable();
    projectService.project$.subscribe(project => {
      if (project) 
        this.projectId = project.id;
    });
    
  }
  public execute(state: DataStateChangeEventArgs): void {
    this.get(state).pipe().subscribe(members => {
      this.projectMemberSource$.next(members)
    });
  }
  private get(state: DataStateChangeEventArgs){

    const searchTerm = state.search?.at(0)?.key?.toString() ?? "";
    const skip = state.skip?.toString() ?? 0;
    const take = state.take?.toString() ?? 10;

    return this.projectService.project$.pipe(
      filter((project): project is IProject => project !== undefined),
      map(p=>p.projectMembers),
      map(members => {

        if (searchTerm) 
         members = members.filter(m =>m.userEmail.toLowerCase().startsWith(searchTerm.toLowerCase()) );
        
        const result:ISyncfusionFormat<IProjectMember> = {
          result: members.slice(Number(skip), Number(skip) + Number(take)),
          count: members.length
        }

        return result;
      })  
      )
  }
  delete(state: DataSourceChangedEventArgs){

    let id ='';
    if (Array.isArray(state.data))
      id=state.data[0].id;
    else
      this.toastrService.error("Error occured")

    return this.http.delete<void>(`${this.baseUrl}/projects/${this.projectId}/task/${id}`);
  }
}
