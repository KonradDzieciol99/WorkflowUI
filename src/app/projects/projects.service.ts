import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataResult, DataSourceChangedEventArgs, DataStateChangeEventArgs, Sorts } from '@syncfusion/ej2-angular-grids';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, forkJoin, map, mergeMap, Observable, of, Subject, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProject } from '../shared/models/IProject';
import { IProjectCreateRequest } from '../shared/models/IProjectCreateRequest';
import { ISyncfusionFormat } from '../shared/models/ISyncfusionFormat';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService  {
  private BASE_URL = 'https://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/Orders';
  projectsUrl: string;

  //extends BehaviorSubject<DataStateChangeEventArgs>
  private projectsSource:BehaviorSubject<DataStateChangeEventArgs> = new BehaviorSubject<DataStateChangeEventArgs>({} as DataStateChangeEventArgs);
  public projects$:Observable<DataStateChangeEventArgs> = this.projectsSource.asObservable();
  constructor(private http: HttpClient,private toastrService:ToastrService) {
    //super({} as DataStateChangeEventArgs);
    //{} as any
    this.projectsUrl = environment.projectsUrl;
  }
  public execute(state: any): void {
    this.getData(state).pipe(take(1)).subscribe(x => {
      this.projectsSource.next(x as any)
    });
    // of({result:[{id:["dfg","dsfg","dfg","dfg"]}],count:4}).subscribe(x => {
    //   super.next(x as any)
    // });

  }
//: Observable<DataStateChangeEventArgs>
  protected getData(state: DataStateChangeEventArgs) {

    // let parameters = {"page":1,"per_page":1};
    // let queryParams = new HttpParams({ fromObject: parameters });


    let params = new HttpParams();
    params = params.append('skip', state.skip?.toString() ?? 0 );
    params = params.append('take', state.take?.toString() ?? 0);
    // params = params.append('orderBy', state.o?.toString() ?? 0);
    // params = params.append('isDescending', state.?.toString() ?? 0);
    // params = params.append('filter', state.take?.toString() ?? 0);
    // params = params.append('groupBy', state.take?.toString() ?? 0);
    params = params.append('search', state.search?.at(0)?.key?.toString() ?? "");
    // params = params.append('selectedColumns', state.take?.toString() ?? 0);
    // params = params.append('take', state.take?.toString() ?? 0);
    // params = params.append('take', state.take?.toString() ?? 0);
    // params = params.append('take', state.take?.toString() ?? 0);
    //params = params.append('take', state.?.toString() ?? 0);

    // const pageQuery = `$skip=${state.skip}&$top=${state.take}`;
    // let sortQuery = '';
    // const d = 'd';
    // const results = 'results';
    // const count = '__count';
    // // if ((state.sorted || []).length)
    // if (state.sorted) {
    //   sortQuery = `&$orderby=` + state.sorted.map((obj: Sorts) => {
    //     return obj.direction === 'descending' ? `${obj.name} desc` : obj.name;
    //   }).reverse().join(',');
    // }

    //return this.http.get<Array<IProject>>(`${this.identityServerUrl}/IdentityUser/search/${email}`);


    return this.http.get<ISyncfusionFormat<IProject>>(`${this.projectsUrl}/projects`,{params: params})
    //.pipe(
      //////////map(response => response.map(x=>x.id)),
      ////////// map(response => {
      //////////   let format:any = {
      //////////     result: response,
      //////////     count: response.length
      //////////   }
      //////////   return format as any;
      //let format:ISyncfusionFormat<IProject> = {}
      //   {
      //   result: response,
      //   count: response.length,)
      // } as any)),
      //(data: DataStateChangeEventArgs) => data
      //////////////}))
      //.pipe((data: any) => data);
  }
  createProject(projectCreateRequest:IProjectCreateRequest){

    return this.http.post<IProject>(`${this.projectsUrl}/projects`,projectCreateRequest).pipe(
      mergeMap(project=>forkJoin({project: of(project),projects: this.projectsSource.pipe(take(1))})), 
      tap(result=>{
        let oldData = result.projects as any as ISyncfusionFormat<IProject>;

        oldData.result.push(result.project);
        oldData.count=oldData.result.length;

        let newData:ISyncfusionFormat<IProject>={
          result: oldData.result,
          count: oldData.count
        }

        this.projectsSource.next(newData as any);
      }

      ));
  }
  deleteProject(state: DataSourceChangedEventArgs){

    let id:string='';
    if (Array.isArray(state.data))
      id=state.data[0].id;
    else
      this.toastrService.error("Error occured")
    

    return this.http.delete<void>(`${this.projectsUrl}/projects/${id}`);
    
  }
}
