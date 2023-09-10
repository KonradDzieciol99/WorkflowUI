import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  ActionEventArgs,
  AddEventArgs,
  DataSourceChangedEventArgs,
  DataStateChangeEventArgs,
  DeleteEventArgs,
  EditEventArgs,
  EditSettingsModel,
  FilterEventArgs,
  GridComponent,
  GroupEventArgs,
  PageEventArgs,
  PageSettingsModel,
  SaveEventArgs,
  SearchEventArgs,
  SortEventArgs,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import {
  Subject,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  of,
  take,
  takeUntil,
} from 'rxjs';
import { ConfirmWindowComponent } from 'src/app/shared/components/confirm-window/confirm-window.component';
import {
  IProjectMember,
  InvitationStatus,
  ProjectMemberType,
  isIProjectMember,
} from 'src/app/shared/models/IProjectMember';
import { ProjectMembersService } from '../../services/project-members.service';
import { ProjectService } from '../../services/project.service';
import { IAppTask } from 'src/app/shared/models/IAppTask';
import { CreateTaskModalComponent } from 'src/app/tasks/components/modals/create-task-modal/create-task-modal.component';
import { EditMemberModalComponent } from '../edit-member-modal/edit-member-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-settings-members',
  templateUrl: './settings-members.component.html',
  styleUrls: ['./settings-members.component.scss'],
})
export class SettingsMembersComponent implements OnInit, OnDestroy {
  public pageSettings: PageSettingsModel;
  public toolbar: ToolbarItems[];
  @ViewChild('grid') grid?: GridComponent;
  public editSettings: EditSettingsModel;
  invitationStatus: typeof InvitationStatus = InvitationStatus;
  projectMemberType: typeof ProjectMemberType = ProjectMemberType;
  searchMembers: FormControl<string>;
  private ngUnsubscribeSource$: Subject<void>;
  constructor(
    private modalServiceNGB: NgbModal,
    public projectMembersService: ProjectMembersService,
    private projectService: ProjectService,
    private modalService: BsModalService,
    private toastrService: ToastrService,
  ) {
    this.pageSettings = { pageSize: 10 /*, pageCount: 8*/ };
    this.toolbar = ['Delete', 'Edit','Cancel'];
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      
    };
    // mode: 'Dialog',
    this.searchMembers = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    });
    this.ngUnsubscribeSource$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.searchMembers.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribeSource$),
      )
      .subscribe({
        next: (value) => {
          if (this.grid) this.grid.search(value);
        },
      });
  }
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.projectMembersService
      .execute(state)
      .pipe(takeUntil(this.ngUnsubscribeSource$))
      .subscribe();
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

            let id = '';

            if (
              Array.isArray(state.data) &&
              state.data.length > 0 &&
              isIProjectMember(state.data[0])
            )
              id = state.data[0].id;
            else throw new Error('id not given');

            return this.projectService.deleteMember(id);
          }),
          takeUntil(this.ngUnsubscribeSource$),
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
  }
  ngOnDestroy(): void {
    this.ngUnsubscribeSource$.next();
  }

  actionBegin (args:PageEventArgs|GroupEventArgs|FilterEventArgs|SearchEventArgs|SortEventArgs|AddEventArgs|SaveEventArgs|EditEventArgs|DeleteEventArgs|ActionEventArgs){
    if (args.requestType === 'beginEdit') {
      let editArgs = args as EditEventArgs;
      editArgs.cancel = true; 
      // const initialState: ModalOptions<EditMemberModalComponent> = {
      //   initialState: {
      //     projectMember: editArgs.rowData as IProjectMember,
      //   },
      //   class: 'modal-lg modal-dialog-centered',
      // };

      const modalRef = this.modalServiceNGB.open(EditMemberModalComponent);
      modalRef.componentInstance.projectMember = editArgs.rowData as IProjectMember;
    }
  }

}
