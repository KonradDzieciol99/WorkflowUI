import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SizeService {

  constructor(private http: HttpClient) { }

  private currentToolbarSizeSource = new ReplaySubject<number>(1);
  currentToolbarSize$ = this.currentToolbarSizeSource.asObservable();
  private currentButtonStateSource = new ReplaySubject<boolean>(1);
  currentButtonStateSource$ = this.currentButtonStateSource.asObservable();

  SetToolbarSize(size: number) {
    this.currentToolbarSizeSource.next(size+32);
  }

  SetButtonState(state: boolean) {
    this.currentButtonStateSource.next(state);
  }

}
