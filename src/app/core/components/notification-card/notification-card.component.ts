import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { mergeMap, of, take, takeUntil, tap } from 'rxjs';
import { MessagesService } from 'src/app/messages/messages.service';
import { ConfirmWindowComponent } from 'src/app/shared/components/confirm-window/confirm-window.component';
import { EventType, INotification, isINotification, NotificationType } from 'src/app/shared/models/INotification';
import { PresenceService } from 'src/app/shared/services/presence.service';

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
  constructor(public messagesService:MessagesService,
    private toastrService:ToastrService,
    private presenceService:PresenceService,
    private modalService: BsModalService) {
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
  markNotificationAsRead(id:string){
    this.presenceService.markNotificationAsRead(id).subscribe(()=>{
      this.toastrService.success("Notification marked as read.")
    });
  }
  deleteNotification(id:string){

    // const initialState: ModalOptions = {
    //   initialState: {
    //     list: [
    //       'Open a modal with component',
    //       'Pass your data',
    //       'Do something else',
    //       '...'
    //     ],
    //     title: 'Modal with component'
    //   }
    // };

    let bsModalRef = this.modalService.show(ConfirmWindowComponent, {class: 'modal-sm'});

    // if (bsModalRef.content && bsModalRef.content.closeBtnName) {
    //   bsModalRef.content.closeBtnName ='Close';
    // }

    bsModalRef.content?.result?.pipe(
      take(1),
      takeUntil(this.modalService.onHide),
      takeUntil(this.modalService.onHidden),
      mergeMap(x=>{
        if (x) {
          return this.presenceService.deleteNotification(id).pipe(
            take(1),
            tap(()=>this.toastrService.success("Notification has been removed.")));
        }
        return of()
      })
      ).subscribe()

    // this.presenceService.deleteNotification(id).subscribe(()=>{
    //   this.toastrService.success("Notification has been removed.")
    // });
  }

}
