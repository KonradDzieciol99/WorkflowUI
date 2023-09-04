import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import {
  BehaviorSubject,
  Observable,
  Subject,
  concatMap,
  take,
  takeUntil,
} from 'rxjs';
import { ProjectService } from 'src/app/projects/services/project.service';
import { IProject } from 'src/app/shared/models/IProject';
import { TasksService } from 'src/app/tasks/tasks.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ProjectMembersService } from '../../services/project-members.service';
@Component({
  selector: 'app-project-side-bar',
  templateUrl: './project-side-bar.component.html',
  styleUrls: ['./project-side-bar.component.scss'],
})
export class ProjectSideBarComponent implements OnInit, OnDestroy {
  private dismissReason: string;
  private sidenavStateSource$: BehaviorSubject<boolean>;
  project$: Observable<IProject | undefined>;
  sidenavState$: Observable<boolean>;
  @ViewChild('sideBar', { static: true }) sideBarRef?: TemplateRef<unknown>;
  private ngUnsubscribeSource$: Subject<void>;
  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private projectMembersService: ProjectMembersService,
    private tasksService: TasksService,
    private router: Router,
    private offcanvasService: NgbOffcanvas,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.ngUnsubscribeSource$ = new Subject<void>();

    this.dismissReason = 'Resizing';

    this.project$ = this.projectService.project$;
    this.sidenavStateSource$ = new BehaviorSubject(true);
    this.sidenavState$ = this.sidenavStateSource$.asObservable();
    this.sidenavState$
      .pipe(takeUntil(this.ngUnsubscribeSource$))
      .subscribe((state) => {
        if (state) this.onResize();
        else this.offcanvasService.dismiss(this.dismissReason);
      });
  }
  ngOnInit(): void {
    this.onResize();
    const state = { skip: 0, take: 10 };

    const projectId = this.activatedRoute.snapshot.params['id'] as string;
    if (!projectId) throw new Error('projectId has bad format');

    this.projectService
      .get(projectId)
      .pipe(
        take(1),
        concatMap((project) => {
          this.breadcrumbService.set('@projectSideBar', project.name);
          return this.tasksService.execute(state).pipe(take(1));
        }),
        concatMap(() =>
          this.projectMembersService.execute(state).pipe(take(1)),
        ),
        takeUntil(this.ngUnsubscribeSource$),
      )
      .subscribe({
        error: async () => await this.router.navigate(['../projects']),
      });
  }
  changeStateSideNav() {
    this.sidenavState$
      .pipe(take(1), takeUntil(this.ngUnsubscribeSource$))
      .subscribe((state) => this.sidenavStateSource$.next(!state));
  }
  ngOnDestroy(): void {
    this.ngUnsubscribeSource$.next();
  }
  @HostListener('window:resize') onResize() {
    const mdBreakpoint = 768;
    const screenWidth = window.innerWidth;

    if (
      screenWidth <= mdBreakpoint &&
      this.sideBarRef &&
      !this.offcanvasService.hasOpenOffcanvas() &&
      this.sidenavStateSource$.getValue()
    ) {
      this.offcanvasService
        .open(this.sideBarRef, {
          panelClass: 'sidebar-width default-transition',
          scroll: true,
        })
        .result.then(() => {
          this.sidenavStateSource$.next(false);
        })
        .catch((error) => {
          if (error === this.dismissReason) return;

          this.sidenavStateSource$.next(false);
        });
    }

    if (screenWidth > mdBreakpoint)
      this.offcanvasService.dismiss(this.dismissReason);
  }
}
