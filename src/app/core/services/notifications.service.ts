import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  notificationServiceUrl: string;
  constructor(private http: HttpClient) {
    this.notificationServiceUrl = environment.notificationServiceUrl;

   }
  //  markNotificationAsRead(){
  //   return this.http.put<IFriendInvitation[]>(`${this.notificationServiceUrl}api/FriendInvitation/GetAllInvitations`).pipe(
  //     tap(invitations=>this.invitationsSource.next(invitations))
  //   );
  // }

}
