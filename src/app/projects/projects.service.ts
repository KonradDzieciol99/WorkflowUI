import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataResult, DataStateChangeEventArgs, Sorts } from '@syncfusion/ej2-angular-grids';
import { map, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProject } from '../shared/models/IProject';
import { ISyncfusionFormat } from '../shared/models/ISyncfusionFormat';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService extends Subject<DataStateChangeEventArgs> {
  private BASE_URL = 'https://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/Orders';
  projectsUrl: string;

  
  
  constructor(private http: HttpClient) {
    super();
    this.projectsUrl = environment.projectsUrl;
  }
  public execute(state: any): void {
    this.getData(state).subscribe(x => super.next(x));
  }
//: Observable<DataStateChangeEventArgs>
  protected getData(state: DataStateChangeEventArgs) {

    let params = new HttpParams();
    params = params.append('skip', state.skip?.toString() ?? 0 );
    params = params.append('take', state.take?.toString() ?? 0);
    // params = params.append('orderBy', state.o?.toString() ?? 0);
    // params = params.append('isDescending', state.?.toString() ?? 0);
    // params = params.append('filter', state.take?.toString() ?? 0);
    // params = params.append('groupBy', state.take?.toString() ?? 0);
    // params = params.append('search', state.take?.toString() ?? 0);
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


    return this.http.get<Array<IProject>>(`${this.projectsUrl}/projects`,{params: params}).pipe(
      map(response => {
        let format:ISyncfusionFormat<IProject> = {
          result: response,
          count: response.length
        }
        return format as any;
        //let format:ISyncfusionFormat<IProject> = {}
      //   {
      //   result: response,
      //   count: response.length,)
      // } as any)),
      //(data: DataStateChangeEventArgs) => data
      }))
      //.pipe((data: any) => data);
  }
}

//}
