import { Component, OnInit } from '@angular/core';
import { IconPickerComponent } from '../icon-picker/icon-picker.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PhotosService } from 'src/app/shared/services/photos.service';
import { take, takeUntil } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IProjectMember, ProjectMemberType } from 'src/app/shared/models/IProjectMember';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settingsForm?: FormGroup;

  constructor(private modalService:BsModalService,private photosService:PhotosService,private projectService:ProjectService) {

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
    })//destroy

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
    //this.projectService.update()
  }

}
