import { Component, OnInit } from '@angular/core';
import { TokenDbo } from './models/TokenDbo.model';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'WorkflowUI';

  constructor(private authenticationService: AuthenticationService/*, private presence: PresenceService*/) {}
  ngOnInit() {
    this.setCurrentUser();
  }
  setCurrentUser() {
    const user: TokenDbo = JSON.parse(localStorage.getItem('JWT_TOKEN'));
    if (user) {
      this.authenticationService.SetSession(user);
    }
      ///this.presence.createHubConnection(user);
  }
}
