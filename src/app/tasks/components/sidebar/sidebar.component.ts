import { Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, take } from 'rxjs';
import { IProject } from 'src/app/shared/models/IProject';
import { ProjectService } from '../../services/project.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit,OnDestroy  {

  private dismissReason:string="Resizing";
  private sidenavStateSub: Subscription;
  private sidenavStateSource:BehaviorSubject<boolean> ;
  project$:Observable<IProject|undefined>;
  sidenavState$:Observable<boolean>;
  @ViewChild('sideBar', { static: true }) sideBarRef: TemplateRef<any> | undefined ;

  constructor(private activatedRoute: ActivatedRoute,private projectService:ProjectService,private router: Router,private offcanvasService: NgbOffcanvas) {
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
  ngOnInit(): void {
    this.onResize()

    let projectname = this.activatedRoute.snapshot.params['projectname'] 

    this.projectService.get(projectname).pipe(take(1)).subscribe({
      error:()=> this.router.navigate(['../projects']),
    })
  }
  changeStateSideNav(){
    this.sidenavState$.pipe(take(1)).subscribe(state=>this.sidenavStateSource.next(!state));
  }
  ngOnDestroy(): void {
    this.sidenavStateSub.unsubscribe();
  }
}
