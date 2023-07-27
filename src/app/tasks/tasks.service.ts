import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataSourceChangedEventArgs, DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { IAppTask } from 'src/app/shared/models/IAppTask';
import { ISyncfusionFormat } from 'src/app/shared/models/ISyncfusionFormat';
import { environment } from 'src/environments/environment';
import { ProjectService } from '../projects/services/project.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private projectId?: string;
  private baseUrl;
  private tasksSource:BehaviorSubject<DataStateChangeEventArgs>;
  public tasks$:Observable<DataStateChangeEventArgs>;
  constructor(private http: HttpClient,private toastrService:ToastrService,projectService:ProjectService) {
    this.baseUrl = environment.tasksUrl;
    this.tasksSource = new BehaviorSubject<DataStateChangeEventArgs>({} as DataStateChangeEventArgs);
    this.tasks$ = this.tasksSource.asObservable();
    projectService.project$.subscribe(project => {
      if (project) 
        this.projectId = project.id;
    });
    
  }
  public execute(state: any): void {
    this.getData(state).pipe(take(1)).subscribe(x => {
      this.tasksSource.next(x as any)
    });
  }
  protected getData(state: DataStateChangeEventArgs) {

    let params = new HttpParams();
    params = params.append('skip', state.skip?.toString() ?? 0 );
    params = params.append('take', state.take?.toString() ?? 0);
    params = params.append('projectId', this.projectId!);
    params = params.append('search', state.search?.at(0)?.key?.toString() ?? "");
    
    return this.http.get<ISyncfusionFormat<Array<IAppTask>>>(`${this.baseUrl}/projects/${this.projectId}/task`,{params: params})
  }
  create(){
  }
  delete(state: DataSourceChangedEventArgs){
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
