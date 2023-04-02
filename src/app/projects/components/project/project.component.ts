import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit  {
  public marginPx:number=200;
  ngOnInit(): void {
  }
  private sidenavStateSource:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  sidenavState$ = this.sidenavStateSource.asObservable();
  changeStateSideNav(){
    this.sidenavState$.pipe(take(1)).subscribe(state=>this.sidenavStateSource.next(!state));
  }
}
