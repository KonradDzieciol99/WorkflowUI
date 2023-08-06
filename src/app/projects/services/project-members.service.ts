import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, combineLatest, concatMap, filter, map, of, take, tap } from 'rxjs';
import { ISyncfusionFormat } from 'src/app/shared/models/ISyncfusionFormat';
import { environment } from 'src/environments/environment';
import { ProjectService } from './project.service';
import { IProjectMember } from 'src/app/shared/models/IProjectMember';
import { DataSourceChangedEventArgs, DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { IProject } from 'src/app/shared/models/IProject';

@Injectable({
  providedIn: 'root'
})
export class ProjectMembersService {
  private projectId?: string;
  private baseUrl;
  private projectMemberSource:BehaviorSubject<ISyncfusionFormat<IProjectMember>>;
  public projectMember$:Observable<ISyncfusionFormat<IProjectMember>>;
  constructor(private http: HttpClient,private toastrService:ToastrService,private projectService:ProjectService) {
    this.baseUrl = environment.tasksUrl;
    this.projectMemberSource = new BehaviorSubject<ISyncfusionFormat<IProjectMember>>({result: [], count: 0});
    this.projectMember$ = this.projectMemberSource.asObservable();
    projectService.project$.subscribe(project => {
      if (project) 
        this.projectId = project.id;
    });
    
  }
  public execute(state: any): void {
    this.get(state).pipe().subscribe(members => {
      this.projectMemberSource.next(members)
    });
  }
  private get(state: DataStateChangeEventArgs): Observable<ISyncfusionFormat<IProjectMember>> {

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

    // let params = new HttpParams();
    // params = params.append('skip', state.skip?.toString() ?? 0 );
    // params = params.append('take', state.take?.toString() ?? 0);
    // params = params.append('projectId', this.projectId!);
    // params = params.append('search', state.search?.at(0)?.key?.toString() ?? "");
    
    // return this.http.get<ISyncfusionFormat<IProjectMember>>(`${this.baseUrl}/projects/${this.projectId}/task`,{params: params}).pipe(
    //   map(response => {
    //     response.result = response.result.map(task => {
    //       task.dueDate = new Date(task.dueDate);
    //       task.startDate = new Date(task.startDate);
    //       return task;
    //     });
    //     return response;
    //   })
    // );
  }
  // create(task:ICreateAppTask){
  //   return this.http.post<IAppTask>(`${this.baseUrl}/projects/${this.projectId}/task`,task).pipe(
  //     take(1),
  //     concatMap((task) =>
  //       combineLatest([
  //         of(task),
  //         this.tasks$
  //       ]).pipe(take(1))
  //     ),
  //     tap(([newTask,currenTasks]) =>{
  //      newTask.taskAssignee=task.taskAssignee;
  //      newTask.taskLeader=task.taskLeader;
  //      const syncfusionFormat:ISyncfusionFormat<IAppTask> = {result: [...currenTasks.result,newTask], count: (currenTasks.count +1) }
  //      this.tasksSource.next(syncfusionFormat)
  //     })
  //   )
  // }
  delete(state: DataSourceChangedEventArgs){

    let id:string='';
    if (Array.isArray(state.data))
      id=state.data[0].id;
    else
      this.toastrService.error("Error occured")

    return this.http.delete<void>(`${this.baseUrl}/projects/${this.projectId}/task/${id}`);
    // .pipe(
    //   take(1),
    //   concatMap(() => this.tasks$.pipe(take(1))),
    //   tap((currenTasks) =>{
    //   const filteredTasks = currenTasks.
    //    const syncfusionFormat:ISyncfusionFormat<IAppTask> = {result: [...currenTasks.result,newTask], count: (currenTasks.count +1) }
    //    this.tasksSource.next(syncfusionFormat)
    //   })
    // )
  }
  // update(task:IAppTask){
  //   return this.http.put<void>(`${this.baseUrl}/projects/${this.projectId}/task/${task.id}`,task).pipe(
  //     take(1),
  //     concatMap(() =>this.tasks$.pipe(take(1))),
  //     tap((currentTasks) =>{
  //       const updatedTasks = currentTasks.result.map(t => t.id === task.id ? task : t);
  //       const syncfusionFormat:ISyncfusionFormat<IAppTask> = {result: updatedTasks, count: currentTasks.count }
  //       this.tasksSource.next(syncfusionFormat)
  //     })
  //   )
  // }
}
