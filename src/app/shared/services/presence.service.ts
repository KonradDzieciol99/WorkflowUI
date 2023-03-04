import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { INotification } from '../models/INotification';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl = environment.signalRhubUrl;
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();
  private notificationsSource = new BehaviorSubject<INotification[]>([]);
  notifications$ = this.notificationsSource.asObservable();
  constructor(private toastr: ToastrService, private router: Router) { }

  createHubConnection(userAccessToken:string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'Presence', {
        accessTokenFactory: () => userAccessToken,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    //this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', username => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: usernames => this.onlineUsersSource.next([...usernames, username])
      })
    })

    this.hubConnection.on('UserIsOffline', username => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: usernames => this.onlineUsersSource.next(usernames.filter(x => x !== username))
      })
    })

    this.hubConnection.on('GetOnlineUsers', usernames => {
      this.onlineUsersSource.next(usernames);
    })

    this.hubConnection.on('NewMessageReceived', ({username, knownAs}) => {
      this.toastr.info(knownAs + ' has sent you a new message! Click me to see it')
        .onTap
        .pipe(take(1))
        .subscribe({
          ///////////////!!!!!!!!!!!!!!!!!!!!!!
          next: () => this.router.navigateByUrl('/members/' + username + '?tab=Messages')//!!!!!!!!!!!!!!!!!
        })
    });

    this.hubConnection.on('NewInvitationToFriendsReceived', ({inviterEmail}) => {
      this.toastr.info(`${inviterEmail} sent you a friend request.`)
        .onTap
        .pipe(take(1))
        .subscribe({
          ///////////////!!!!!!!!!!!!!!!!!!!!!!
          //next: () => this.router.navigateByUrl('/members/' + username + '?tab=Messages')//!!!!!!!!!!!!!!!!!
        })
    });
    // this.hubConnection.on('NewChatNotificationReceived', (notification:INotification) => {
    //   this.onlineUsersSource.next(usernames);
    // })
    this.hubConnection.on('NewNotificationReceived', (notification:INotification) => {
      this.notifications$.pipe(take(1)).subscribe(notifications=>{
        this.notificationsSource.next([...notifications,notification]);
      })
    });
    this.hubConnection.on('NotificationThread', (notifications:INotification[]) => {
      // this.toastr.info(`${notification.content}`)
      //   .onTap
      //   .pipe(take(1))
      //   .subscribe({
      //     ///////////////!!!!!!!!!!!!!!!!!!!!!!
      //     //next: () => this.router.navigateByUrl('/members/' + username + '?tab=Messages')//!!!!!!!!!!!!!!!!!
      //   })
      console.log(notifications);
      this.notificationsSource.next(notifications);
    });
    var hubConnectionState = this.hubConnection.start()
    .catch(error => console.log(error))
    .finally(/*() => this.busyService.idle()*/);

    return hubConnectionState;
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.log(error));
  }
}
