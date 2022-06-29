import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from 'src/app/models/Team.model';
import { TokenDbo } from 'src/app/models/TokenDbo.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  currentTeam!:Team;
  currentUser!:TokenDbo;

  constructor(public teamService: TeamService, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    //this.currentTeam=this.teamService.currentTeam$

    this.teamService.currentTeam$.subscribe(T=>this.currentTeam= T);

    this.authenticationService.currentUser$.subscribe(T=>this.currentUser=T);
  }

}
