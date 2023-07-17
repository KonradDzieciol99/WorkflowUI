// import { Injectable } from '@angular/core';
// import { HttpClient } from '@microsoft/signalr';
// import { BehaviorSubject, take, tap } from 'rxjs';
// import { INotification } from 'src/app/shared/models/INotification';
// import { environment } from 'src/environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class NotificationsService {
//   private notificationUrl;
//   private hubUrl;
//   private notificationsSource;
//   public notifications$;
 
//   constructor(private http: HttpClient) { 
//     this.hubUrl = environment.signalRhubUrl;
//     this.notificationUrl = environment.notificationUrl;
//     this.notificationsSource = new BehaviorSubject<INotification[]>([]);
//     this.notifications$= this.notificationsSource.asObservable();
//   }

//   getAllNotifications(){
//     return this.http.get<INotification[]>(`${this.notificationUrl}/AppNotification`).pipe(
//       take(1),
//       tap(notifications=>this.notificationsSource.next(notifications))
//     );
//   }
//   markNotificationAsRead(id:string){
//     return this.http.put<void>(`${this.notificationUrl}/AppNotification/${id}`,{}).pipe(
//       take(1),
//       tap(()=>{
//         this.notifications$.pipe(take(1)).subscribe(notifications=>{
//           let nextNotifications = notifications.map((notification) =>
//             notification.id === id ? { ...notification, displayed: true } : notification 
//           );
//           this.notificationsSource.next(nextNotifications);
//         })

//       })
//     );
//   }
//   deleteNotification(id:string){
//     return this.http.delete<void>(`${this.notificationUrl}/AppNotification/${id}`).pipe(
//       take(1),
//       tap(()=>{
//         this.notifications$.pipe(take(1)).subscribe(notifications=>{
//           let nextNotifications = notifications.filter(notification => notification.id !== id);
//           this.notificationsSource.next(nextNotifications);
//         })

//       })
//     );
//   }
// }
