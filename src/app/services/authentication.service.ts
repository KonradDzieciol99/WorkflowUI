import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenDbo } from '../models/TokenDbo.model';
import { ReplaySubject, shareReplay } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSource = new ReplaySubject<TokenDbo>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {

  }
  
  Register(email: string, password: string) {
    return this.http.post<TokenDbo>('api/Account/Register', { email, password }).pipe(
      map((user: TokenDbo) => {
        if (user) {
         this.SetSession(user);
         //this.presence.createHubConnection(user);
        }
      })
    )
  }
  Login(email: string, password: string) {
    return this.http.post<TokenDbo>('api/Account/Login', { email, password }, { withCredentials: true }).pipe(
      map((response: TokenDbo) => {
        const user = response;
        if (user) {
          this.SetSession(user);
          //this.presence.createHubConnection(user);
        }
      })
    )
  }
  logout() {
    localStorage.removeItem("JWT_TOKEN");
    this.currentUserSource.next(null);
    //this.presence.stopHubConnection();
    console.log("usunieto tokeny");
  }
  SetSession(authResult: TokenDbo) {
    localStorage.setItem("JWT_TOKEN", JSON.stringify(authResult));
    this.currentUserSource.next(authResult);
    console.log("dodano tokeny");
  }
}