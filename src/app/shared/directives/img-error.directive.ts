import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img'
})
export class ImgErrorDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}
  
  @HostListener("error")
  private onError() {
    const imgElement = this.el.nativeElement as HTMLImageElement;
    imgElement.src="assets/images/user.png"
    this.renderer.addClass(imgElement, 'loaded-error');
  }
}
