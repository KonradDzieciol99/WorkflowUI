import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, combineLatest, map, merge, mergeMap, Observable, of, pipe, retry, skip, skipWhile, take, takeUntil, tap, throwError, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAuthResponse } from '../shared/models/IAuthResponse';
import { IRegisterUser } from '../shared/models/IRegisterUser';
import { IUser } from '../shared/models/IUser';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser|undefined>(undefined);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient,
     private router: Router,
     private toastrService:ToastrService,
     private cookieService: CookieService) {
   }

  setAutoLogOutAndReminders(token:string){
   
    // this.currentUser$.pipe(skip(1),take(1)).subscribe(()=>{
    //     this.toastrService.clear(activeToast.toastId);
    // })

    let timeNowInMiliseconds= new Date().valueOf()
    let logoutTime:Date = new Date(timeNowInMiliseconds + (environment.AUTO_LOGOUT_TIME_IN_MINUTES * 60 * 1000));
    let reminderTime = new Date(logoutTime.valueOf() - (1 * 60 * 1000));

    let logoutTimer$ = timer(logoutTime).pipe(
      takeUntil(this.currentUserSource.pipe(skip(1))),
      mergeMap(()=>{
       return this.logout();
      }),
      tap(()=>{
        this.toastrService.info("sesja się zakończyła")
      })
    );
    let reminderTimer$ = timer(reminderTime).pipe(
      take(1),//take w sub?
      takeUntil(this.currentUserSource.pipe(skipWhile(user=>user!==undefined))),
      mergeMap(()=>{
        let activeToast = this.toastrService.info(`Z powodu braku aktywności sesja zakończy się w mniej niż minutę kliknij aby wydłużyć sesję`,undefined,{timeOut:0,extendedTimeOut:0});
        return activeToast.onTap.pipe(
          mergeMap(()=>{
            return this.refreshCurrentUser()
          }),
          tap(()=>{
            this.toastrService.info("Wydłużam sesję")
          })
          )
      })
    );
    //forkjoin?
    merge(logoutTimer$,reminderTimer$).subscribe((value) => {
      console.log(value);
    })
    //przemyśleć to
  }
  refreshCurrentUser() {
    const cookies = this.cookieService.get("isLoginIn");
    if ((!cookies) || cookies!=="true") {
      return throwError(() => new Error("Empty cookie"));
    }
    return this.http.post<IUser>(this.baseUrl + 'account/refresh-token',{},{ withCredentials: true }).pipe(
      map((user?: IUser) => {
        if (user) {
          this.currentUserSource.next(user);
          this.setAutoLogOutAndReminders(user.token);
        }
      })
    )
  }
  login(values: any):Observable<void> {
    return this.http.post<IAuthResponse>(this.baseUrl + 'account/login', values,{withCredentials: true}).pipe(
      map((authResponse: IAuthResponse) => {
        if (authResponse.userDto) {
          this.currentUserSource.next(authResponse.userDto);
          this.setAutoLogOutAndReminders(authResponse.userDto.token);//userlogin event?
          this.cookieService.set("isLoginIn","true",undefined,undefined,undefined,true,undefined);
          this.router.navigateByUrl('/home');
          this.toastrService.success("Zalogowano");
        } else if (authResponse.isEmailVerified === false) {
          this.router.navigateByUrl("auth/verifyEmail")
        } else {
          throw new Error("Auth error");
        }
      })
    )
  }
  register(registerUser: IRegisterUser):Observable<void> {
    return this.http.post<IAuthResponse>(this.baseUrl + 'account/register', registerUser ,{withCredentials: true}).pipe(
      map((authResponse: IAuthResponse) => {
        if (authResponse.isEmailVerified === false) {
          this.router.navigateByUrl("auth/verifyEmail")
        } else {
          throw new Error("Auth error");
        }
      }),
    )
  }
  logout() {
    return this.http.post<undefined>(this.baseUrl + 'account/revoke-token', {},{withCredentials: true}).pipe(
      map(() => {
        this.cookieService.delete(environment.COOKIE_REFRESH_TOKEN_NAME);//revoke request
        this.cookieService.delete("isLoginIn");
        this.currentUserSource.next(undefined);
        this.router.navigateByUrl('/auth');
        this.toastrService.clear();
        this.toastrService.success("logged out successfully");
      })
    )
  }
  test(){
    return this.http.post<any>(this.baseUrl + 'account/test', {},{withCredentials: true});
  }
  resendVerificationEmail(email:string){
    let httpParams = new HttpParams().set("email",email)
    return this.http.post<undefined>(this.baseUrl + 'account/resend-verification-email', {},{params:httpParams});
  }
  resetPassword(email:string){
    let httpParams = new HttpParams().set("email",email)
    return this.http.post<undefined>(this.baseUrl + 'account/reset-password', {},{params:httpParams});
  }
}
    // this.cookieService.delete(environment.COOKIE_REFRESH_TOKEN_NAME);//revoke request
    // this.currentUserSource.next(undefined);
    // this.router.navigateByUrl('/auth');
    // this.toastrService.clear();
    // this.toastrService.success("logged out successfully");
    // this.cookieService.delete("isLoginIn");

// merge(logoutTimer$,reminderTimer$).pipe(
//   takeUntil(this.currentUserSource.pipe(skip(1)))
// ).subscribe((value) => {
//   console.log(value);
// })

    // logoutTimer$.pipe(
    //   takeUntil(this.currentUserSource.pipe(skip(1)))
    // ).subscribe((value) => {
    //   console.log(value);
    // })
    
    // reminderTimer$.pipe(
    //   take(1),
    //   takeUntil(this.currentUserSource.pipe(skipWhile(user=>user!==undefined)))
    // ).subscribe((value) => {
    //   console.log(value);
    // })