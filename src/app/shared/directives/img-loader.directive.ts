import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img'
})
export class ImgLoaderDirective {
  
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('load', ['$event.target'])
  onLoad(img: HTMLImageElement) {
    this.renderer.addClass(img, 'loaded');
  }

}
