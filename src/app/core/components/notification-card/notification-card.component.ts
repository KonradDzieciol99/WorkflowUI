import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MessagesService } from 'src/app/messages/messages.service';
import { EventType, INotification, isINotification, NotificationType } from 'src/app/shared/models/INotification';

@Component({
  selector: 'app-notification-card[notification]',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent implements OnInit{

  @Input("notification") notificationValue: any;
  notification:INotification|undefined;

  //Events: typeof EventType = EventType;
  notificationsTypes: typeof NotificationType = NotificationType;
  constructor(public messagesService:MessagesService,private toastrService:ToastrService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notificationValue']) {
      if ( !this.notificationValue || !(isINotification(this.notificationValue))) {
        throw new Error("Invalid input value 'notificationValue' in NotificationCardComponent");
      }
       this.notification = this.notificationValue;
       
    }
    
  }
  ngOnInit(): void {

  }
  acceptFriendInvitation(senderId:string){
    this.messagesService.acceptFriendInvitation(senderId).subscribe(()=>{
      this.toastrService.success("Invitation accepted.")
      //this.invitations$=this.invitations$.pipe(map(invitations=>invitations.filter(x=>x===invitation)));
      //this.invitations$=
    });
  }
  rejectFriendInvitation(senderId:string){

  }


}
