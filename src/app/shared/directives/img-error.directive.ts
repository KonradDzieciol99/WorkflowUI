import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'img'
})
export class ImgErrorDirective {

  constructor(private el: ElementRef) {}
  
  @HostListener("error")
  private onError() {
    (this.el.nativeElement as HTMLImageElement).src="assets/images/user.png"
    
    //.style.display = "none";
  }
}
