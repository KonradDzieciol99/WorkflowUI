import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { BehaviorSubject,concatMap,catchError,map,Observable,tap, throwError ,mergeMap, ReplaySubject} from 'rxjs';
import { Team } from '../models/Team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService{

  private CurrentTeamSource = new ReplaySubject<Team>(1);
  currentTeam$ = this.CurrentTeamSource.asObservable()

  constructor(private http: HttpClient) { }

  CreateTeam(Team:Team) {
    return this.http.post<Team>('api/Teams/CreateTeam',{Name:Team.name});
  }
  GetAll() {
    return this.http.get<Team[]>('api/Teams/GetAll');
  }
  GetTeam(id: number) {
    return this.http.get<Team>('api/Teams/GetOne/'+id);
  }
  DeleteTeam(team: Team) {
    return this.http.delete<Team[]>('api/Teams/DeleteTeam/'+team.id);
  }
  SetCurrentTeam(data: Team) {
    this.CurrentTeamSource.next(data);
  }
  //zacząć używać !take(1)!
}
