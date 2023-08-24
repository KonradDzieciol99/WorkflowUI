import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataSourceChangedEventArgs, DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, combineLatest, concatMap, filter, map, mergeMap, of, take, tap } from 'rxjs';
import { IAppTask, isIAppTask } from 'src/app/shared/models/IAppTask';
import { ISyncfusionFormat } from 'src/app/shared/models/ISyncfusionFormat';
import { environment } from 'src/environments/environment';
import { ProjectService } from '../projects/services/project.service';
import { ICreateAppTask } from '../shared/models/ICreateAppTask';
import { IProject } from '../shared/models/IProject';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  // private projectId?: string;
  private baseUrl;
  private tasksSource$:BehaviorSubject<ISyncfusionFormat<IAppTask>>;
  public tasks$:Observable<ISyncfusionFormat<IAppTask>>;
  constructor(private http: HttpClient,private toastrService:ToastrService,private projectService:ProjectService) {
    this.baseUrl = environment.tasksUrl;
    this.tasksSource$ = new BehaviorSubject<ISyncfusionFormat<IAppTask>>({result: [], count: 0});
    this.tasks$ = this.tasksSource$.asObservable();
    // projectService.project$.subscribe(project => {
    //   if (project) 
    //     this.projectId = project.id;
    // });
    
  }
  public execute(state: DataStateChangeEventArgs) {
    return this.getData(state).pipe(
        tap(x=>this.tasksSource$.next(x))
      )

  }
  protected getData(state: DataStateChangeEventArgs) {

    return this.projectService.project$.pipe(
      filter((project): project is IProject => project !== undefined),
      mergeMap(project=>{

        let params = new HttpParams();
        params = params.append('skip', state.skip?.toString() ?? 0 );
        params = params.append('take', state.take?.toString() ?? 0);
        params = params.append('projectId', project.id);
        params = params.append('search', state.search?.at(0)?.key?.toString() ?? "");
        
        return this.http.get<ISyncfusionFormat<IAppTask>>(`${this.baseUrl}/projects/${project.id}/task`,{params: params}).pipe(
          map(response => {
            response.result = response.result.map(task => {
              task.dueDate = new Date(task.dueDate);
              task.startDate = new Date(task.startDate);
              return task;
            });
            return response;
          })
        );

      })
    )
  }
  create(task:ICreateAppTask){
    return this.projectService.project$.pipe(
      filter((project): project is IProject => project !== undefined),
      mergeMap(project=>{
        return this.http.post<IAppTask>(`${this.baseUrl}/projects/${project.id}/task`,task).pipe(
          take(1),
          concatMap((task) =>
            combineLatest([
              of(task),
              this.tasks$
            ]).pipe(take(1))
          ),
          tap(([newTask,currenTasks]) =>{
           newTask.taskAssignee=task.taskAssignee;
           newTask.taskLeader=task.taskLeader;
           const syncfusionFormat:ISyncfusionFormat<IAppTask> = {result: [...currenTasks.result,newTask], count: (currenTasks.count +1) }
           this.tasksSource$.next(syncfusionFormat)
          })
        )
      })
    )
  }
  delete(state: DataSourceChangedEventArgs){

    let id = '' ;
    
    if (Array.isArray(state.data) && state.data.length > 0 && isIAppTask(state.data[0])) 
      id = state.data[0].id;
    else
      throw new Error("Error occured")
    
    return this.projectService.project$.pipe(
      filter((project): project is IProject => project !== undefined),
      mergeMap(project=>{return this.http.delete<void>(`${this.baseUrl}/projects/${project.id}/task/${id}`)})
    );
  }
  update(task:IAppTask){
    return this.projectService.project$.pipe(
      filter((project): project is IProject => project !== undefined),
      mergeMap(project=>{
        return this.http.put<void>(`${this.baseUrl}/projects/${project.id}/task/${task.id}`,task).pipe(
          take(1),
          concatMap(() =>this.tasks$.pipe(take(1))),
          tap((currentTasks) =>{
            const updatedTasks = currentTasks.result.map(t => t.id === task.id ? task : t);
            const syncfusionFormat:ISyncfusionFormat<IAppTask> = {result: updatedTasks, count: currentTasks.count }
            this.tasksSource$.next(syncfusionFormat)
          })
        )
      })
    );
  }
}