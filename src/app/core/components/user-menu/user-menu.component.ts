import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  profilePictureUrl?: string;
  constructor(private readonly oAuthService: OAuthService) {}

  ngOnInit(): void {
    let idToken=this.oAuthService.getIdentityClaims();

    let picture = idToken['picture'] as string  | undefined;

    if (picture)
      this.profilePictureUrl=picture;
      
  }
  
  logout():void{
     this.oAuthService.logOut()
    // this.oAuthService.revokeTokenAndLogout()
  }

}
