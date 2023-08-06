import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataSourceChangedEventArgs, DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, combineLatest, concatMap, map, of, take, tap } from 'rxjs';
import { IAppTask } from 'src/app/shared/models/IAppTask';
import { ISyncfusionFormat } from 'src/app/shared/models/ISyncfusionFormat';
import { environment } from 'src/environments/environment';
import { ProjectService } from '../projects/services/project.service';
import { ICreateAppTask } from '../shared/models/ICreateAppTask';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private projectId?: string;
  private baseUrl;
  private tasksSource:BehaviorSubject<ISyncfusionFormat<IAppTask>>;
  public tasks$:Observable<ISyncfusionFormat<IAppTask>>;
  constructor(private http: HttpClient,private toastrService:ToastrService,projectService:ProjectService) {
    this.baseUrl = environment.tasksUrl;
    this.tasksSource = new BehaviorSubject<ISyncfusionFormat<IAppTask>>({result: [], count: 0});
    this.tasks$ = this.tasksSource.asObservable();
    projectService.project$.subscribe(project => {
      if (project) 
        this.projectId = project.id;
    });
    
  }
  public execute(state: any): void {
    this.getData(state).pipe(take(1)).subscribe(x => {
      this.tasksSource.next(x)
    });
  }
  protected getData(state: DataStateChangeEventArgs) {

    let params = new HttpParams();
    params = params.append('skip', state.skip?.toString() ?? 0 );
    params = params.append('take', state.take?.toString() ?? 0);
    params = params.append('projectId', this.projectId!);
    params = params.append('search', state.search?.at(0)?.key?.toString() ?? "");
    
    return this.http.get<ISyncfusionFormat<IAppTask>>(`${this.baseUrl}/projects/${this.projectId}/task`,{params: params}).pipe(
      map(response => {
        response.result = response.result.map(task => {
          task.dueDate = new Date(task.dueDate);
          task.startDate = new Date(task.startDate);
          return task;
        });
        return response;
      })
    );
  }
  create(task:ICreateAppTask){
    return this.http.post<IAppTask>(`${this.baseUrl}/projects/${this.projectId}/task`,task).pipe(
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
       this.tasksSource.next(syncfusionFormat)
      })
    )
  }
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
  update(task:IAppTask){
    return this.http.put<void>(`${this.baseUrl}/projects/${this.projectId}/task/${task.id}`,task).pipe(
      take(1),
      concatMap(() =>this.tasks$.pipe(take(1))),
      tap((currentTasks) =>{
        const updatedTasks = currentTasks.result.map(t => t.id === task.id ? task : t);
        const syncfusionFormat:ISyncfusionFormat<IAppTask> = {result: updatedTasks, count: currentTasks.count }
        this.tasksSource.next(syncfusionFormat)
      })
    )
  }
}























// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { DataSourceChangedEventArgs, DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
// import { ToastrService } from 'ngx-toastr';
// import { BehaviorSubject, Observable, forkJoin, mergeMap, of, take, tap } from 'rxjs';
// import { environment } from 'src/environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class TasksService {
//   private tasksSource:BehaviorSubject<DataStateChangeEventArgs|undefined> 
//   public projects$:Observable<DataStateChangeEventArgs|undefined>;
//   constructor(private http: HttpClient,private toastrService:ToastrService) {
//     this.tasksSource = new BehaviorSubject<DataStateChangeEventArgs|undefined>(undefined);
//     this.projects$ = this.tasksSource.asObservable();
//   }
//   protected getData(state: DataStateChangeEventArgs) {

//     let params = new HttpParams();
//     params = params.append('skip', state.skip?.toString() ?? 0 );
//     params = params.append('take', state.take?.toString() ?? 0);
//     params = params.append('search', state.search?.at(0)?.key?.toString() ?? "");

//     return this.http.get<ISyncfusionFormat<IProject>>(`${this.projectsUrl}/projects`,{params: params})
//   }
//   createProject(projectCreateRequest:IProjectCreateRequest){

//     return this.http.post<IProject>(`${this.projectsUrl}/projects`,projectCreateRequest).pipe(
//       mergeMap(project=>forkJoin({project: of(project),projects: this.projectsSource.pipe(take(1))})), 
//       tap(result=>{
//         let oldData = result.projects as any as ISyncfusionFormat<IProject>;

//         oldData.result.push(result.project);
//         oldData.count=oldData.result.length;

//         let newData:ISyncfusionFormat<IProject>={
//           result: oldData.result,
//           count: oldData.count
//         }

//         this.projectsSource.next(newData as any);
//       }

//       ));
//   }
//   deleteProject(state: DataSourceChangedEventArgs){

//     let id:string='';
//     if (Array.isArray(state.data))
//       id=state.data[0].id;
//     else
//       this.toastrService.error("Error occured")
    

//     return this.http.delete<void>(`${this.projectsUrl}/projects/${id}`);
    
//   }
// }
