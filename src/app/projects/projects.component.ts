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
  searchProjects = new FormControl<string>('',[Validators.required]);
  constructor(public service: ProjectsService,private modalService: BsModalService,private toastrService:ToastrService) {
    this.pageSettings = { pageSize: 10/*, pageCount: 8*/ };
    this.toolbar = ['Delete'];
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
  }
  createProject(){
    let bsModalRef = this.modalService.show(CreateProjectModalComponent, {class: 'modal-sm modal-dialog-centered'});
  }
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.service.execute(state);
  }
  public dataSourceChanged(state: DataSourceChangedEventArgs): void {

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
        },
        complete:()=> {
          if (state.endEdit) 
            state.endEdit();
        },
      });
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
       }
      })

  }
}