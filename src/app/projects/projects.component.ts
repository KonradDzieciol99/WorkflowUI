import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  DataSourceChangedEventArgs,
  DataStateChangeEventArgs,
  EditSettingsModel,
  GridComponent,
  PageSettingsModel,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  mergeMap,
  of,
  take,
  takeUntil,
} from 'rxjs';
import { ConfirmWindowComponent } from '../shared/components/confirm-window/confirm-window.component';
import { CreateProjectModalComponent } from './components/modals/create-project-modal/create-project-modal.component';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  public pageSettings: PageSettingsModel;
  public toolbar: ToolbarItems[];
  @ViewChild('grid') grid?: GridComponent;
  public editSettings: EditSettingsModel;
  searchProjects: FormControl<string>;
  private ngUnsubscribeSource$: Subject<void>;
  constructor(
    public service: ProjectsService,
    private modalService: BsModalService,
  ) {
    this.pageSettings = { pageSize: 10 /*, pageCount: 8*/ };
    this.toolbar = ['Delete'];
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
    };
    this.searchProjects = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    });
    this.ngUnsubscribeSource$ = new Subject<void>();
  }

  createProject() {
    //const bsModalRef =
    this.modalService.show(CreateProjectModalComponent, {
      class: 'modal-sm modal-dialog-centered',
    });
  }
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.service.execute(state);
  }
  public dataSourceChanged(state: DataSourceChangedEventArgs): void {
    if (state.requestType === 'delete') {
      const bsModalRef = this.modalService.show(ConfirmWindowComponent, {
        class: 'modal-sm modal-dialog-centered',
      });

      bsModalRef.content?.result$
        .pipe(
          take(1),
          mergeMap((value) => {
            if (!value) return of();
            return this.service.deleteProject(state);
          }),
          takeUntil(this.ngUnsubscribeSource$),
        )
        .subscribe({
          complete: () => {
            if (state.endEdit) state.endEdit();
          },
        });
    }
  }
  ngOnInit(): void {
    const state = { skip: 0, take: 10 };
    this.service.execute(state);
    this.searchProjects.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribeSource$),
      )
      .subscribe({
        next: (value) => {
          this.grid?.search(value);
        },
      });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribeSource$.next();
  }
}
