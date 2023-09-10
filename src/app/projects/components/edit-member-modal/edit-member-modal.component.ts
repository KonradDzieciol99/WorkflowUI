import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IProjectMember, InvitationStatus, ProjectMemberType } from 'src/app/shared/models/IProjectMember';
import { ProjectService } from '../../services/project.service';
import { Subject, take, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { isProblemDetails } from 'src/app/shared/models/ProblemDetails';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectMembersService } from '../../services/project-members.service';

@Component({
  selector: 'app-edit-member-modal',
  templateUrl: './edit-member-modal.component.html',
  styleUrls: ['./edit-member-modal.component.scss']
})
export class EditMemberModalComponent implements OnInit, OnDestroy {

  @Input() projectMember?: IProjectMember;
  projectMemberForm?: FormGroup<{
    id: FormControl<string>;
    userId: FormControl<string>;
    userEmail: FormControl<string>;
    type: FormControl<ProjectMemberType>;
    invitationStatus: FormControl<InvitationStatus>;
    projectId: FormControl<string>;
    photoUrl: FormControl<string | undefined>;
  }>;
  private ngUnsubscribeSource$: Subject<void>;
  public dropDownPanelOpen: boolean;
  currentType?: string;
  typeMap: Map<ProjectMemberType, string>;
  projectMemberTypes: typeof ProjectMemberType;

  constructor(public activeModal: NgbActiveModal,
              private projectService:ProjectService,
              private projectMembersService:ProjectMembersService,
              private toastrService:ToastrService,
              public cdref: ChangeDetectorRef) {
    this.ngUnsubscribeSource$ = new Subject<void>();
    this.dropDownPanelOpen = true;
    this.typeMap = new Map<ProjectMemberType, string>([
      [ProjectMemberType.Leader, 'Leader'],
      [ProjectMemberType.Admin, 'Admin'],
      [ProjectMemberType.Member, 'Member'],
    ]);
    this.projectMemberTypes = ProjectMemberType;
  }
  ngOnDestroy(): void {
    this.ngUnsubscribeSource$.next();
   }
  ngOnInit(): void {
    if (!this.projectMember) return;
    this.currentType = this.typeMap.get(this.projectMember.type);
    this.projectMemberForm = new FormGroup(
      {
        id: new FormControl(this.projectMember.id, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        userId: new FormControl(this.projectMember.userId, {
          nonNullable: true,
          validators: [Validators.required],
        }), 
        userEmail: new FormControl(this.projectMember.userEmail, {
          nonNullable: true,
          validators: [Validators.required],
        }), 
        type: new FormControl<ProjectMemberType>(this.projectMember.type, {
          nonNullable: true,
          validators: [Validators.required],
        }), 
        invitationStatus: new FormControl<InvitationStatus>(this.projectMember.invitationStatus, {
          nonNullable: true,
          validators: [Validators.required],
        }), 
        projectId: new FormControl(this.projectMember.projectId, {
          nonNullable: true,
          validators: [Validators.required],
        }), 
        photoUrl: new FormControl<string|undefined>(this.projectMember.photoUrl, {
          nonNullable: true,
          validators: [],
        }), 
      },
    );
    this.projectMemberForm.get('type')?.valueChanges.pipe(
      takeUntil(this.ngUnsubscribeSource$)
    ).subscribe(value=>{
      this.currentType=this.typeMap.get(value)
    })
  }
  update() {
    if (!this.projectMemberForm) return;

    if (this.projectMemberForm.invalid) {
      this.projectMemberForm.markAllAsTouched();
      return;
    }
    const values = this.projectMemberForm.getRawValue();
    this.projectMembersService
      .updateMember(values.id, {type:values.type,projectId:values.projectId,userId:values.userId})
      .pipe(take(1), takeUntil(this.ngUnsubscribeSource$))
      .subscribe({
        next: () => {
          this.toastrService.success(`Member has been updated`);
          this.activeModal.close();
        },
        error: (error) => {
          if (isProblemDetails(error))
            this.projectMemberForm?.setErrors({ serverError: error.detail });
        }
      });
  }
  onOpenChange(isOpen: boolean): void {
    this.dropDownPanelOpen = isOpen;
  }
}
