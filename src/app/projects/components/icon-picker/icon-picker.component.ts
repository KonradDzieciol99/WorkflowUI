import { Component, OnInit, Renderer2 } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject, take } from 'rxjs';
import { IIcon } from 'src/app/shared/models/IIcon';
import { PhotosService } from 'src/app/shared/services/photos.service';

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss']
})
export class IconPickerComponent implements OnInit {
  result: Subject<IIcon> 
  icons?:Observable<Array<IIcon>>;
  selectedIcon?:IIcon;
  constructor(private photosService:PhotosService,public bsModalRef: BsModalRef,private renderer: Renderer2) {
    this.result = new Subject<IIcon>();
  }
  ngOnInit(): void {
    // this.icons = this.photosService.icons$;

  }
  select(){
    if (this.selectedIcon) {
      this.result.next(this.selectedIcon);
      this.bsModalRef.hide();
    }
     
  }
  onImageLoad(event: Event ){
    this.renderer.addClass(event.target as HTMLImageElement, 'loaded');
  }

}
