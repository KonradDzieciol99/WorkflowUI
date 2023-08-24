import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subject, takeUntil } from 'rxjs';
import { PresenceService } from './shared/services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private title: string;
  public showHeader: boolean;
  private showSidebar: boolean;
  private showFooter: boolean;
  private ngUnsubscribeSource$: Subject<void>;
  constructor(
    private readonly oAuthService: OAuthService,
    private presenceService: PresenceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.title = 'WorkflowUI';
    this.showHeader = false;
    this.showSidebar = false;
    this.showFooter = false;
    this.ngUnsubscribeSource$ = new Subject<void>();
  }

  async ngOnInit() {
    await this.initialize();
  }
  async initialize() {
    this.router.events
      .pipe(takeUntil(this.ngUnsubscribeSource$))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.showHeader =
            this.activatedRoute.firstChild?.snapshot.data['showHeader'] !==
            false
              ? true
              : false;
          this.showSidebar =
            this.activatedRoute.firstChild?.snapshot.data['showSidebar'] !==
            false
              ? true
              : false;
          this.showFooter =
            this.activatedRoute.firstChild?.snapshot.data['showFooter'] !==
            false
              ? true
              : false;
        }
      });

    await this.presenceService.createHubConnection(
      this.oAuthService.getAccessToken(),
    );
  }
  ngOnDestroy(): void {
    this.ngUnsubscribeSource$.next();
  }
}
