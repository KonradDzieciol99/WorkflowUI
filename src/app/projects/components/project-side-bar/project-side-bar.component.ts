import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, take } from 'rxjs';
import { ProjectService } from 'src/app/projects/services/project.service';
import { IProject } from 'src/app/shared/models/IProject';
@Component({
  selector: 'app-project-side-bar',
  templateUrl: './project-side-bar.component.html',
  styleUrls: ['./project-side-bar.component.scss']
})
export class ProjectSideBarComponent implements OnInit  {


  test: Observable<boolean> = of(true);

  project$:Observable<IProject|undefined>;
  constructor(private activatedRoute: ActivatedRoute,private projectService:ProjectService,private router: Router) {
    this.project$=this.projectService.project$;
  }
  public marginPx:number=200;
  ngOnInit(): void {
    let projectname = this.activatedRoute.snapshot.params['projectname'] 
    this.projectService.get(projectname).pipe(take(1)).subscribe({
      error:()=> this.router.navigate(['../projects']),
    })
  }
  private sidenavStateSource:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  sidenavState$ = this.sidenavStateSource.asObservable();
  changeStateSideNav(){
    this.sidenavState$.pipe(take(1)).subscribe(state=>this.sidenavStateSource.next(!state));
  }
}
