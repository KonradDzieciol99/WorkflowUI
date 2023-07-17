import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GoogleAuthService } from './authentication/google-auth.service';
import { IdentityServerService } from './authentication/identity-server.service';
import { MicrosoftOpeinIDAuthService } from './authentication/microsoft-opein-id-auth.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { PresenceService } from './shared/services/presence.service';
import { take } from 'rxjs';

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
    
  ngOnInit(): void {
    this.initialize();
  }
  initialize():void{
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = this.activatedRoute.firstChild?.snapshot.data['showHeader']!== false ? true : false;
        this.showSidebar = this.activatedRoute.firstChild?.snapshot.data['showSidebar']!== false ? true : false;
        this.showFooter = this.activatedRoute.firstChild?.snapshot.data['showFooter']!== false ? true : false;
      }
    });
    this.presenceService.createHubConnection(this.oAuthService.getAccessToken())
  }

}
