import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DataSourceChangedEventArgs, DataStateChangeEventArgs, EditSettingsModel, GridComponent, PageSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { concatMap, debounceTime, distinctUntilChanged, of, take } from 'rxjs';
import { ConfirmWindowComponent } from 'src/app/shared/components/confirm-window/confirm-window.component';
import { InvitationStatus, ProjectMemberType } from 'src/app/shared/models/IProjectMember';
import { ProjectMembersService } from '../../services/project-members.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-settings-members',
  templateUrl: './settings-members.component.html',
  styleUrls: ['./settings-members.component.scss']
})
export class SettingsMembersComponent implements OnInit {
  public pageSettings: PageSettingsModel;
  public toolbar: ToolbarItems[];
  @ViewChild('grid') grid?: GridComponent;
  public editSettings: EditSettingsModel;
  searchMembers = new FormControl<string>('',[Validators.required]);
  invitationStatus: typeof InvitationStatus = InvitationStatus;
  projectMemberType: typeof ProjectMemberType = ProjectMemberType;

  constructor(public projectMembersService:ProjectMembersService,
              private projectService:ProjectService,
              private modalService: BsModalService,
              private toastrService:ToastrService) {
      this.pageSettings = { pageSize: 10/*, pageCount: 8*/ };
      this.toolbar = ['Delete'];
      this.editSettings = { allowEditing: false, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
  }
  ngOnInit(): void {
    this.searchMembers.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe({
      next:(value)=>{
        if(this.grid) 
          this.grid.search(value ?? "");
       }
      })
  }
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.projectMembersService.execute(state);
  }
  public dataSourceChanged(state: DataSourceChangedEventArgs): void {

    if (state.requestType === 'delete') {

      const bsModalRef = this.modalService.show(ConfirmWindowComponent, {class: 'modal-sm modal-dialog-centered'});

      bsModalRef.content?.result$?.pipe(
        take(1),
        concatMap(value=>{
          
          if(!value) return of();

          let id:string;
          if (Array.isArray(state.data))
            id=state.data[0]?.id
          else
            throw new Error('id not given')
          
          return this.projectService.deleteMember(id);
        })
      )
      .subscribe({
        next:()=> {
          this.toastrService.success(`Task has been deleted`);

      },
        complete:()=> {
          if (state.endEdit) 
            state.endEdit();
        },
      });
    }
  }
}
