import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamHomeResolver implements Resolve<boolean> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    
    return this.memberService.getMember(route.paramMap.get('id'));

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
