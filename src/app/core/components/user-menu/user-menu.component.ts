import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  public profilePictureUrl?: string;
  public email?: string;
  public isNotificationPanelOpen: boolean;

  constructor(private readonly oAuthService: OAuthService) { 
    this.isNotificationPanelOpen = false;
  }

  ngOnInit(): void {
    const idToken=this.oAuthService.getIdentityClaims();

    const picture = idToken['picture'] as string | undefined;

    const email = idToken['email'] as string | undefined;
    
    if(email)
      this.email=email;
  
    if (picture)
      this.profilePictureUrl=picture;
      
  }
  
  logout():void{
     this.oAuthService.logOut()
  }
  onOpenChange(isOpen: boolean): void {
    this.isNotificationPanelOpen = isOpen;
  }
}
