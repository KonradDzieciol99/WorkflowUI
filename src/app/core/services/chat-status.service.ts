// import { Injectable } from '@angular/core';
// import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
// import { environment } from 'src/environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class ChatStatusService {
//   private hubConnection?: HubConnection;
//   private hubUrl;
//   constructor() {
//     this.hubUrl = environment.signalRhubUrl;
//   }
//   createHubConnection(userAccessToken:string) {
//     this.hubConnection = new HubConnectionBuilder()
//       .withUrl(this.hubUrl + 'Presence', {
//         accessTokenFactory: () => userAccessToken,
//         transport: HttpTransportType.WebSockets
//       })
//       .withAutomaticReconnect()
//       .build();

//     //this.hubConnection.start().catch(error => console.log(error));

//     this.hubConnection.on('UserIsOnline', username => {
//       this.onlineUsers$.pipe(take(1)).subscribe({
//         next: usernames => this.onlineUsersSource.next([...usernames, username])
//       })
//     })

//     this.hubConnection.on('UserIsOffline', username => {
//       this.onlineUsers$.pipe(take(1)).subscribe({
//         next: usernames => this.onlineUsersSource.next(usernames.filter(x => x !== username))
//       })
//     })

//     this.hubConnection.on('GetOnlineUsers', usernames => {
//       this.onlineUsersSource.next(usernames);
//     })

//     this.hubConnection.on('NewMessageReceived', ({username, knownAs}) => {
//       this.toastr.info(knownAs + ' has sent you a new message! Click me to see it')
//         .onTap
//         .pipe(take(1))
//         .subscribe({
//           ///////////////!!!!!!!!!!!!!!!!!!!!!!
//           next: () => this.router.navigateByUrl('/members/' + username + '?tab=Messages')//!!!!!!!!!!!!!!!!!
//         })
//     });

//     this.hubConnection.on('NewInvitationToFriendsReceived', ({inviterEmail}) => {
//       this.toastr.info(`${inviterEmail} sent you a friend request.`)
//         .onTap
//         .pipe(take(1))
//         .subscribe({
//           ///////////////!!!!!!!!!!!!!!!!!!!!!!
//           //next: () => this.router.navigateByUrl('/members/' + username + '?tab=Messages')//!!!!!!!!!!!!!!!!!
//         })
//     });
//     // this.hubConnection.on('NewChatNotificationReceived', (notification:INotification) => {
//     //   this.onlineUsersSource.next(usernames);
//     // })
//     this.hubConnection.on('NewNotificationReceived', (newNotification:INotification) => {
//       this.notifications$.pipe(take(1)).subscribe(notifications=>{
//         let oldNotificationIndex=notifications.findIndex(x=>x.id===newNotification.id);

//         if (oldNotificationIndex !== -1) {
//           notifications.splice(oldNotificationIndex, 1);
//         }
        
//         this.notificationsSource.next([...notifications,newNotification]);
//       })
//     });
//     // this.hubConnection.on('NotificationThread', (notifications:INotification[]) => { //teraz trzba najpierw pobrac po http
//     //   // this.toastr.info(`${notification.content}`)
//     //   //   .onTap
//     //   //   .pipe(take(1))
//     //   //   .subscribe({
//     //   //     ///////////////!!!!!!!!!!!!!!!!!!!!!!
//     //   //     //next: () => this.router.navigateByUrl('/members/' + username + '?tab=Messages')//!!!!!!!!!!!!!!!!!
//     //   //   })
//     //   console.log(notifications);
//     //   this.notificationsSource.next(notifications);
//     // });
//     var hubConnectionState = this.hubConnection.start()
//     .catch(error => console.log(error))
//     .finally(/*() => this.busyService.idle()*/);
//     return hubConnectionState;
//   }
// }
