import { Component, Renderer2 } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { IIcon } from 'src/app/shared/models/IIcon';

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss'],
})
export class IconPickerComponent {
  private resultSource$: Subject<IIcon>;
  result$: Observable<IIcon>;
  icons$?: Observable<IIcon[]>;
  selectedIcon?: IIcon;
  constructor(
    public bsModalRef: BsModalRef,
    private renderer: Renderer2,
  ) {
    this.resultSource$ = new Subject();
    this.result$ = this.resultSource$.asObservable();
  }
  select() {
    if (!this.selectedIcon) return;

    this.resultSource$.next(this.selectedIcon);
    this.bsModalRef.hide();
  }
}
