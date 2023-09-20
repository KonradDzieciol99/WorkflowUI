import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PhotosService } from 'src/app/shared/services/photos.service';
import { ProjectService } from '../../services/project.service';
import { IconPickerComponent } from '../icon-picker/icon-picker.component';
import {
  Observable,
  Subject,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IProjectMember,
  ProjectMemberType,
} from 'src/app/shared/models/IProjectMember';
import { IProject } from 'src/app/shared/models/IProject';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings-details',
  templateUrl: './settings-details.component.html',
  styleUrls: ['./settings-details.component.scss'],
})
export class SettingsDetailsComponent implements OnInit, OnDestroy {
  private ngUnsubscribeSource$: Subject<void>;
  projectMembers$: Observable<IProjectMember[]>;
  initialProjectValue?: IProject;
  formHasChanged: boolean;
  settingsForm?: FormGroup<{
    id: FormControl<string>;
    name: FormControl<string>;
    iconUrl: FormControl<string>;
    leader: FormControl<IProjectMember>;
  }>;
  constructor(
    private modalService: BsModalService,
    private photosService: PhotosService,
    private projectService: ProjectService,
    private toastrService:ToastrService
  ) {
    this.formHasChanged = false;
    this.projectMembers$ = this.projectService.project$.pipe(
      map((x) => {
        return x?.projectMembers ?? [];
      }),
    );
    this.ngUnsubscribeSource$ = new Subject<void>();
  }
  ngOnInit(): void {
    this.projectService.project$
      .pipe(
        filter((project): project is IProject => project !== undefined),
        tap((project) => {
          const leader = project.projectMembers.find(
            (x) => x.type === ProjectMemberType.Leader,
          );

          this.settingsForm = new FormGroup({
            id: new FormControl<string>(project.id, {
              nonNullable: true,
              validators: [Validators.required],
            }),
            name: new FormControl<string>(project.name, {
              nonNullable: true,
              validators: [Validators.required],
            }),
            iconUrl: new FormControl<string>(project.iconUrl, {
              nonNullable: true,
              validators: [Validators.required],
            }),
            leader: new FormControl<IProjectMember>(leader!, {
              nonNullable: true,
              validators: [Validators.required],
            }),
          });

          this.initialProjectValue = project;
        }),
        map(() => this.settingsForm),
        filter(
          (settingsForm): settingsForm is FormGroup =>
            settingsForm !== undefined,
        ),
        switchMap((settingsForm) => settingsForm.valueChanges),
        tap((formData) => {
          const isSameIconUrl =
            this.initialProjectValue?.iconUrl === formData.iconUrl;
          const isSameName = this.initialProjectValue?.name === formData.name;
          const isSameLeader =
            this.initialProjectValue?.projectMembers.find(
              (m) => m.type === ProjectMemberType.Leader,
            )?.id === formData.leader.id;

          this.formHasChanged = !(isSameIconUrl && isSameName && isSameLeader);
        }),
        takeUntil(this.ngUnsubscribeSource$),
      )
      .subscribe();

    this.photosService
      .getProjectsIcons()
      .pipe(take(1), takeUntil(this.ngUnsubscribeSource$))
      .subscribe();
  }
  openIconPicker() {
    const bsModalRef = this.modalService.show(IconPickerComponent, {
      class: 'modal-sm modal-dialog-centered',
    });

    if (bsModalRef.content)
      bsModalRef.content.icons$ = this.photosService.icons$;

    bsModalRef.content?.result$
      .pipe(
        take(1),
        takeUntil(this.modalService.onHide),
        takeUntil(this.modalService.onHidden),
        takeUntil(this.ngUnsubscribeSource$),
      )
      .subscribe({
        next: (IIcon) => {
          this.settingsForm?.get('iconUrl')?.setValue(IIcon.url);
        },
        complete: () => {
          /*sub.unsubscribe();*/
        },
      });
  }
  save() {
    if (!this.settingsForm || this.settingsForm.invalid) 
      return;

    var values = this.settingsForm.getRawValue()
    this.projectService.update({name:values.name,iconUrl:values.iconUrl,newLeaderId: values.leader.id,projectId:values.leader?.projectId})
                       .pipe(
                        take(1),
                        takeUntil(this.ngUnsubscribeSource$)
                        )
                       .subscribe(()=>this.toastrService.success("Project has been updated"))
  }
  ngOnDestroy() {
    this.ngUnsubscribeSource$.next();
    this.ngUnsubscribeSource$.complete();
  }
}
