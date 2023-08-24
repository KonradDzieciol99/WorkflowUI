import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  DataSourceChangedEventArgs,
  DataStateChangeEventArgs,
  EditSettingsModel,
  GridComponent,
  PageSettingsModel,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { concatMap, debounceTime, distinctUntilChanged, of, take } from 'rxjs';
import { ConfirmWindowComponent } from 'src/app/shared/components/confirm-window/confirm-window.component';
import { TasksService } from '../../tasks.service';
import { CreateTaskModalComponent } from '../modals/create-task-modal/create-task-modal.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  public pageSettings: PageSettingsModel;
  public toolbar: ToolbarItems[];
  @ViewChild('grid') grid?: GridComponent;
  public editSettings: EditSettingsModel;
  searchTasks: FormControl<string>;
  constructor(
    public tasksService: TasksService,
    private modalService: BsModalService,
    private toastrService: ToastrService,
  ) {
    this.pageSettings = { pageSize: 10 /*, pageCount: 8*/ };
    this.toolbar = ['Delete', 'Edit'];
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
    };
    this.searchTasks = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    });
  }

  createTask() {
    //let bsModalRef =
    this.modalService.show(CreateTaskModalComponent, {
      class: 'modal-lg modal-dialog-centered',
    });
  }
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.tasksService.execute(state).pipe(take(1)).subscribe();
  }
  public dataSourceChanged(state: DataSourceChangedEventArgs): void {
    if (state.requestType === 'delete') {
      const bsModalRef = this.modalService.show(ConfirmWindowComponent, {
        class: 'modal-sm modal-dialog-centered',
      });

      bsModalRef.content?.result$
        .pipe(
          take(1),
          concatMap((value) => {
            if (!value) return of();

            return this.tasksService.delete(state);
          }),
        )
        .subscribe({
          next: () => {
            this.toastrService.success(`Task has been deleted`);
          },
          complete: () => {
            if (state.endEdit) state.endEdit();
          },
        });
    }
    this.tasksService.tasks$.subscribe((x) => {
      console.log(x);
    });
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

    this.searchTasks.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe({
        next: (value) => {
          if (this.grid) this.grid.search(value);
        },
      });
  }
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id?.endsWith('edit')) {
      const selectedRecord = this.grid?.getSelectedRecords()[0];
      //this.myDialog.open(selectedRecord);
      args.cancel = true; // Prevent the grid's default dialog from opening
      if (!selectedRecord) return;

      const selectedRecordCopy = JSON.parse(JSON.stringify(selectedRecord));

      const initialState: ModalOptions = {
        initialState: {
          updatedTask: selectedRecordCopy,
          title: 'Modal with component',
        },
        class: 'modal-lg modal-dialog-centered',
      };

      //let bsModalRef =
      this.modalService.show(CreateTaskModalComponent, initialState);
    }
  }
}
