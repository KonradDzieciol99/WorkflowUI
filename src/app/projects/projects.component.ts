import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from '@microsoft/signalr';
import { DataSourceChangedEventArgs, DataStateChangeEventArgs, EditSettingsModel, GridComponent, PageSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, debounceTime, distinctUntilChanged, mergeMap, of, take,takeUntil, tap } from 'rxjs';
import { ConfirmWindowComponent } from '../shared/components/confirm-window/confirm-window.component';
import { isNullOrEmpty } from '../shared/helpers';
import { CreateProjectModalComponent } from './components/modals/create-project-modal/create-project-modal.component';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  //providers: [ProjectsService]
})
export class ProjectsComponent implements OnInit {

  public pageSettings: PageSettingsModel;
  public toolbar: ToolbarItems[];
  @ViewChild('grid') grid: GridComponent | undefined;
  public editSettings: EditSettingsModel;


  public test33: Subject<any> = new Subject();
 // sdfsdf=this.test.
  public test2: BehaviorSubject<any> = new BehaviorSubject({});
  //public test2Observable=this.test2.asObservable();
  //data: ProjectsService;

  // projektForm: FormGroup = new FormGroup({
  //   name: new FormControl<string>('',[Validators.required,Validators.minLength(6)]), //","
  //   icon: new FormControl<IIcon|null>(null,[Validators.required]),
  // });
  searchProjects = new FormControl<string>('',[Validators.required]);
  constructor(public service: ProjectsService,private modalService: BsModalService,private toastrService:ToastrService) {
    this.pageSettings = { pageSize: 10/*, pageCount: 8*/ };
    this.toolbar = ['Delete'];
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
    //this.data = service;

  }
  createProject(){
    let bsModalRef = this.modalService.show(CreateProjectModalComponent, {class: 'modal-sm modal-dialog-centered'});
    
    // bsModalRef.content?.result?.pipe(
    //   take(1),
    //   takeUntil(this.modalService.onHide),
    //   takeUntil(this.modalService.onHidden),
    //   mergeMap(x=>{
    //     if (x) {
    //       return this.presenceService.deleteNotification(id).pipe(
    //         take(1),
    //         tap(()=>this.toastrService.success("Notification has been removed.")));
    //     }
    //     return of()
    //   })
    //   ).subscribe()
  }
  public dataStateChange(state: DataStateChangeEventArgs): void {
    //state
    this.service.execute(state);
  }
  public dataSourceChanged(state: DataSourceChangedEventArgs): void {
    // if (state.action === 'add') {
    //     this.crudService.addRecord(state).subscribe(() => {
    //         state.endEdit();
    //     });
    //     this.crudService.addRecord(state).subscribe(() => { }, error => console.log(error), () => {
    //         state.endEdit();
    //     });
    // } else if (state.action === 'edit') {
    //     this.crudService.updateRecord(state).subscribe(() => {
    //         state.endEdit();
    //     }, (e) => {
    //         this.grid.closeEdit();
    //     }
    //     );
    // } else 
    if (state.requestType === 'delete') {

      let bsModalRef = this.modalService.show(ConfirmWindowComponent, {class: 'modal-sm modal-dialog-centered'});

      bsModalRef.content?.result?.pipe(
        take(1),
        mergeMap(value=>{
          if(!value) return of();

          return this.service.deleteProject(state);
        })
      )
      .subscribe({
        next:(value)=> {
          //onsole.log();
        },
        complete:()=> {
          if (state.endEdit) 
            state.endEdit();
        },
      });


    
    // this.service.deleteProject(state).subscribe(() => {
    //   if (state.endEdit) 
    //   state.endEdit();
        
    // });

    }
}
  ngOnInit(): void {
    

    const state = { skip: 0 , take: 10 };
    this.service.execute(state);
    this.searchProjects.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe({
      next:(value)=>{
        if(this.grid) 
          this.grid.search(value ?? "");
        // if(this.grid && isNullOrEmpty(value))
        //   this.grid.search("");
          //this.grid.searchSettings.key = '';
       }
      })

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
