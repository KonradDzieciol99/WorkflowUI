import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Team } from 'src/app/models/Team.model';
import { TokenDbo } from 'src/app/models/TokenDbo.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PTaskService } from 'src/app/services/ptask.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  currentTeam:Team;

  constructor(private activatedRoute: ActivatedRoute,
    public ptaskService:PTaskService ,public teamService: TeamService, private authenticationService: AuthenticationService) { 

  }
  ngOnInit(): void {
    
      this.teamService.currentTeam$.subscribe(res=>{this.currentTeam=res;});

  }

}
