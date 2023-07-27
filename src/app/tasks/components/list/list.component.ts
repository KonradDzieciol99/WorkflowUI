import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DataSourceChangedEventArgs, DataStateChangeEventArgs, EditSettingsModel, GridComponent, PageSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, mergeMap, of, take } from 'rxjs';
import { ConfirmWindowComponent } from 'src/app/shared/components/confirm-window/confirm-window.component';
import { TasksService } from '../../tasks.service';
import { CreateTaskModalComponent } from '../modals/create-task-modal/create-task-modal.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  public pageSettings: PageSettingsModel;
  public toolbar: ToolbarItems[];
  @ViewChild('grid') grid: GridComponent | undefined;
  public editSettings: EditSettingsModel;
  searchProjects = new FormControl<string>('',[Validators.required]);
  constructor(public tasksService: TasksService,private modalService: BsModalService,private toastrService:ToastrService) {
    this.pageSettings = { pageSize: 10/*, pageCount: 8*/ };
    this.toolbar = ['Delete'];
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
  }

  createTask(){
    let bsModalRef = this.modalService.show(CreateTaskModalComponent, {class: 'modal-lg modal-dialog-centered'});
  }
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.tasksService.execute(state);
  }
  public dataSourceChanged(state: DataSourceChangedEventArgs): void {

    if (state.requestType === 'delete') {

      let bsModalRef = this.modalService.show(ConfirmWindowComponent, {class: 'modal-sm modal-dialog-centered'});

      // bsModalRef.content?.result?.pipe(
      //   take(1),
      //   mergeMap(value=>{
      //     if(!value) return of();

      //     return this.service.delete(state);
      //   })
      // )
      // .subscribe({
      //   next:(value)=> {
      //   },
      //   complete:()=> {
      //     if (state.endEdit) 
      //       state.endEdit();
      //   },
      // });
    }
}
  ngOnInit(): void {
    // const state = { skip: 0 , take: 10 };
    // this.service.execute(state);
    // this.searchProjects.valueChanges.pipe(
    //   debounceTime(300),
    //   distinctUntilChanged(),
    // ).subscribe({
    //   next:(value)=>{
    //     if(this.grid) 
    //       this.grid.search(value ?? "");
    //    }
    //   })
    //

    //pobrać dane z servisu a nie przez zapytanie !!!!!!
  }
}
