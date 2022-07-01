import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Team } from '../models/Team.model';
import { TeamService } from '../services/team.service';

@Injectable({
  providedIn: 'root'
})
export class TeamHomeResolver implements Resolve<Team> {
  constructor(private teamService: TeamService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Team> {
    
    return this.teamService.GetTeam(+route.paramMap.get('id'));// (+) converts string 'id' to a number

    //return this.memberService.getMember(route.paramMap.get('username'));
    // this.route.params.subscribe(params => {
    //   this.id = +params['id']; // (+) converts string 'id' to a number
    //   this.teamService.GetTeam(this.id).subscribe(team=>{
    //     this.teamService.SetCurrentTeam(team);
    //   },
    //   error=>{this.router.navigateByUrl('/not-found');console.log(error,"redirect to not found ")}
    //   );
  //  });
  }
}
