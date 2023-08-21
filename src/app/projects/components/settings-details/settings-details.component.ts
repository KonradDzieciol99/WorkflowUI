import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PhotosService } from 'src/app/shared/services/photos.service';
import { ProjectService } from '../../services/project.service';
import { IconPickerComponent } from '../icon-picker/icon-picker.component';
import { Observable, map, take, takeUntil } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IProjectMember, ProjectMemberType } from 'src/app/shared/models/IProjectMember';
import { IProject } from 'src/app/shared/models/IProject';

@Component({
  selector: 'app-settings-details',
  templateUrl: './settings-details.component.html',
  styleUrls: ['./settings-details.component.scss']
})
export class SettingsDetailsComponent implements OnInit  {
  settingsForm?: FormGroup;
  projectMembers$:Observable<IProjectMember[]>
  initialProjectValue?: IProject;
  formHasChanged: boolean;

  constructor(private modalService:BsModalService,private photosService:PhotosService,private projectService:ProjectService) {
    this.formHasChanged = false;
    this.projectMembers$ = this.projectService.project$.pipe(map(x => {return x?.projectMembers ?? [];}));
  }
  ngOnInit(): void {

    this.projectService.project$.pipe().subscribe(project=>{

      if (!project) 
        return;   
      var leader = project.projectMembers.find(x=>x.type===ProjectMemberType.Leader)
      this.settingsForm = new FormGroup({
        id: new FormControl<string>(project.id,{ nonNullable: true, validators: [Validators.required]}),
        name: new FormControl<string>(project.name,{ nonNullable: true, validators: [Validators.required]}),
        iconUrl: new FormControl<string>(project.iconUrl,{ nonNullable: true, validators: [Validators.required]}),
        leader: new FormControl<IProjectMember|undefined>(leader,{ nonNullable: true, validators: [Validators.required]}),
      });

      this.initialProjectValue=project;

      this.settingsForm.valueChanges.subscribe(x=>{

          let f=this.initialProjectValue?.iconUrl ===  x.iconUrl
          let g= this.initialProjectValue?.name ===  x.name;
          let test = this.initialProjectValue?.projectMembers.find(m=>m.type===ProjectMemberType.Leader)?.id === x.leader.id;

        if ( f && g && test)
          this.formHasChanged = false;
        else
          this.formHasChanged = true;
         
      })
    })

    this.photosService.getProjectsIcons().pipe(take(1)).subscribe();
  }
  openIconPicker(){
    let bsModalRef = this.modalService.show(IconPickerComponent, {class: 'modal-sm modal-dialog-centered'});
    
    if (bsModalRef.content) 
      bsModalRef.content.icons = this.photosService.icons$; 
    
    bsModalRef.content?.result?.pipe(
      takeUntil(this.modalService.onHide),
      takeUntil(this.modalService.onHidden)
      ).subscribe({
       next:(IIcon) => {
        this.settingsForm?.get("iconUrl")?.setValue(IIcon.url);
       },
       complete:()=>{/*sub.unsubscribe();*/}
      })   
  }
  save(){
    this.settingsForm?.get('iconUrl')?.value
  }
}
