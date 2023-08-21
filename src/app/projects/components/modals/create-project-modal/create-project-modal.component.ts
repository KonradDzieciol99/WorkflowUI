import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, mergeMap, Subject, take, takeUntil } from 'rxjs';
import { ProjectsService } from 'src/app/projects/projects.service';
import { IIcon } from 'src/app/shared/models/IIcon';
import { IProjectCreateRequest } from 'src/app/shared/models/IProjectCreateRequest';
import { PhotosService } from 'src/app/shared/services/photos.service';
import { IconPickerComponent } from '../../icon-picker/icon-picker.component';
import { ImageLoader } from '@angular/common';

@Component({
  selector: 'app-create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.scss']
})
export class CreateProjectModalComponent implements OnInit {

  projektForm: FormGroup = new FormGroup({
    name: new FormControl<string>('',[Validators.required,Validators.minLength(6)]), //","
    icon: new FormControl<IIcon|null>(null,[Validators.required]),
  });

  constructor(public bsModalRef: BsModalRef,private projectsService:ProjectsService,
    private toastrService:ToastrService,private photosService:PhotosService
    ,private modalService: BsModalService,private renderer: Renderer2){
    }
  ngOnInit(): void {
    this.photosService.getProjectsIcons().pipe(take(1)).subscribe({
      next:(icons)=>{
        const random = Math.floor(Math.random() * icons.length);
        this.projektForm.get("icon")?.setValue(icons[random]);
      }
    });
  }
  openIconPicker(){
    let bsModalRef = this.modalService.show(IconPickerComponent, {class: 'modal-sm modal-dialog-centered'});
    
    if (bsModalRef.content) 
      bsModalRef.content.icons = this.photosService.icons$; 
    
    bsModalRef.content?.result?.pipe(
      //take(1),
      takeUntil(this.modalService.onHide),
      takeUntil(this.modalService.onHidden)
      ).subscribe({
       next:(IIcon) => {
        this.projektForm.get("icon")?.setValue(IIcon);
       },
       complete:()=>{/*sub.unsubscribe();*/}
      })
  }
  createProject(){
    if (this.projektForm.invalid) {
      this.projektForm.markAllAsTouched()
      return;
    }

    this.projectsService.createProject(this.projektForm.value as IProjectCreateRequest)
    .pipe(take(1))
    .subscribe({
      next:(project)=>{
        this.toastrService.success(`Project has been created`);
        this.bsModalRef.hide();
      },
      error:(err:HttpErrorResponse)=>{
          this.projektForm.setErrors({serverError: err.error}); 
        },
      });
  }
  onImageLoad(event: Event ){
    this.renderer.addClass(event.target as HTMLImageElement, 'loaded');
  }
}
