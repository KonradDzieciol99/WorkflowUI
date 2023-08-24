import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { PresenceService } from './shared/services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'WorkflowUI';
  showHeader = false;
  showSidebar = false;
  showFooter = false;

  constructor(private readonly oAuthService: OAuthService,
     private presenceService: PresenceService
    ,private router: Router,
    private activatedRoute: ActivatedRoute ) {
      console.log("ddd")
    }
    
  async ngOnInit() {
    await this.initialize();
  }
  async initialize(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = this.activatedRoute.firstChild?.snapshot.data['showHeader']!== false ? true : false;
        this.showSidebar = this.activatedRoute.firstChild?.snapshot.data['showSidebar']!== false ? true : false;
        this.showFooter = this.activatedRoute.firstChild?.snapshot.data['showFooter']!== false ? true : false;
      }
    });
    await this.presenceService.createHubConnection(this.oAuthService.getAccessToken())
  }

}
