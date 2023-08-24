import { Component, Input, OnDestroy, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { State } from '../../models/IAppTask';
import { ITextIconPair } from '../../models/ITextIconPair';

@Component({
  selector: 'app-c-reactive-dropdown',
  templateUrl: './c-reactive-dropdown.component.html',
  styleUrls: ['./c-reactive-dropdown.component.scss'],
})
export class CReactiveDropdownComponent<T>
  implements OnInit, ControlValueAccessor, OnDestroy
{
  isStatusPanelOpen: boolean;
  statuses: typeof State = State;
  control?: FormControl<T>;
  @Input() map?: Map<T, ITextIconPair>;
  currentValue?: ITextIconPair;
  private ngUnsubscribeSource$: Subject<void>;
  ngUnsubscribe$: Observable<void>;
  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
    this.isStatusPanelOpen = false;
    this.ngUnsubscribeSource$ = new Subject<void>();
    this.ngUnsubscribe$ = this.ngUnsubscribeSource$.asObservable();
  }

  ngOnInit(): void {
    this.control = this.controlDir.control as FormControl;

    this.currentValue = this.map?.get(this.control.value);
    this.control.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((state) => {
        this.currentValue = this.map?.get(state);
      });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  onOpenChange(isOpen: boolean): void {
    this.isStatusPanelOpen = isOpen;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  writeValue(obj: any): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  setDisabledState?(isDisabled: boolean): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribeSource$.next();
  }
}
