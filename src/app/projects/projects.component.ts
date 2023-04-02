import { Component, OnInit } from '@angular/core';
import { DataStateChangeEventArgs, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  public pageSettings: PageSettingsModel;
  data: ProjectsService;
  constructor(private service: ProjectsService) {
    this.pageSettings = { pageSize: 2 };
    
    this.data = service;

  }
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.service.execute(state);
  }
  ngOnInit(): void {
    this.pageSettings = { pageSize: 10, pageCount: 4 };
    const state = { skip: 0, take: 10 };
    this.service.execute(state);
  }
  // data = [
  //   {
  //     OrderID: 1,
  //     CustomerID: 'ALFKI',
  //     Freight: 29.46,
  //     OrderDate: new Date('2021-01-01')
  //   },
  //   {
  //     OrderID: 2,
  //     CustomerID: 'ANATR',
  //     Freight: 84.21,
  //     OrderDate: new Date('2021-01-02')
  //   },
  //   {
  //     OrderID: 3,
  //     CustomerID: 'ANTON',
  //     Freight: 52.34,
  //     OrderDate: new Date('2021-01-03')
  //   },
  //   {
  //     OrderID: 4,
  //     CustomerID: 'BLONP',
  //     Freight: 23.72,
  //     OrderDate: new Date('2021-01-04')
  //   },
  //   {
  //     OrderID: 5,
  //     CustomerID: 'BOLID',
  //     Freight: 41.87,
  //     OrderDate: new Date('2021-01-05')
  //   }
  // ];
  
}
