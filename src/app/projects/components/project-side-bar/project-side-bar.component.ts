import { Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbOffcanvas, NgbOffcanvasOptions, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, Subscription, of, take } from 'rxjs';
import { ProjectService } from 'src/app/projects/services/project.service';
import { IProject } from 'src/app/shared/models/IProject';
import { TasksService } from 'src/app/tasks/tasks.service';
import { BreadcrumbService } from 'xng-breadcrumb';
@Component({
  selector: 'app-project-side-bar',
  templateUrl: './project-side-bar.component.html',
  styleUrls: ['./project-side-bar.component.scss']
})
export class ProjectSideBarComponent implements OnInit,OnDestroy  {

  private dismissReason:string="Resizing";
  private sidenavStateSub: Subscription;
  private sidenavStateSource:BehaviorSubject<boolean> ;
  project$:Observable<IProject|undefined>;
  sidenavState$:Observable<boolean>;
  @ViewChild('sideBar', { static: true }) sideBarRef: TemplateRef<any> | undefined ;

  constructor(private activatedRoute: ActivatedRoute,
              private projectService:ProjectService,
              private tasksService:TasksService,
              private router: Router,
              private offcanvasService: NgbOffcanvas,
              private breadcrumbService: BreadcrumbService
              ) {

    this.project$=this.projectService.project$;
    this.sidenavStateSource = new BehaviorSubject<boolean>(true);
    this.sidenavState$ = this.sidenavStateSource.asObservable();
    this.sidenavStateSub = this.sidenavState$.pipe().subscribe(state=>{
      if (state) 
        this.onResize();
      else
        this.offcanvasService.dismiss(this.dismissReason);
    });
  }
  ngOnInit(): void {
    this.onResize()

    let projectId = this.activatedRoute.snapshot.params['id'];

    this.projectService.get(projectId).pipe(take(1)).subscribe({
      next: (project) => {
        this.breadcrumbService.set('@projectSideBar', project.name);
        const state = { skip: 0 , take: 10 };
        this.tasksService.execute(state);
      },
      error:()=> this.router.navigate(['../projects']),
    })
  }
  changeStateSideNav(){
    this.sidenavState$.pipe(take(1)).subscribe(state=>this.sidenavStateSource.next(!state));
  }
  ngOnDestroy(): void {
    this.sidenavStateSub.unsubscribe();
  }
  @HostListener('window:resize') onResize() {

    const mdBreakpoint:number = 768;
    const screenWidth:number = window.innerWidth;

    if (screenWidth <= mdBreakpoint && this.sideBarRef && !this.offcanvasService.hasOpenOffcanvas() && this.sidenavStateSource.getValue() ) {
      this.offcanvasService.open(this.sideBarRef,{ panelClass: 'sidebar-width default-transition', scroll: true  }).result.then((result) => {
        this.sidenavStateSource.next(false);
      }).catch((error) => {
        if (error===this.dismissReason)
          return;

        this.sidenavStateSource.next(false);
      });
    }
    
    if(screenWidth > mdBreakpoint)
      this.offcanvasService.dismiss(this.dismissReason);
  }
}
