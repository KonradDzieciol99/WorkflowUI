import { Component, Renderer2 } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { IIcon } from 'src/app/shared/models/IIcon';

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss']
})
export class IconPickerComponent {
  result$: Subject<IIcon> 
  icons$?:Observable<Array<IIcon>>;
  selectedIcon?:IIcon;
  constructor(public bsModalRef: BsModalRef,private renderer: Renderer2) {
    this.result$ = new Subject<IIcon>();
  }
  select(){
    if (!this.selectedIcon) 
      return;
    
    this.result$.next(this.selectedIcon);
    this.bsModalRef.hide();
  }
  onImageLoad(event: Event ){
    this.renderer.addClass(event.target as HTMLImageElement, 'loaded');
  }

}
