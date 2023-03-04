import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { INotification } from 'src/app/shared/models/INotification';
import { PresenceService } from 'src/app/shared/services/presence.service';

@Component({
  selector: 'app-notifications-panel[isNotificationsPanelExpanded][buttonReference]',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss']
})
//[isNotificationsPanelExpanded]
export class NotificationsPanelComponent {
  @Output('isNotificationsPanelExpanded') isNotificationsPanelExpanded = new EventEmitter<boolean>();
  @Input("buttonReference") buttonReference!:HTMLButtonElement;
  notifications$: Observable<INotification[]>;
  @ViewChild('notificationsPanel') notificationsPanel: ElementRef<HTMLDivElement> | undefined;
  constructor(private presenceService : PresenceService) {
    this.notifications$=this.presenceService.notifications$;
  }
  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: HTMLElement) {
    console.log(targetElement);
    if (this.notificationsPanel) {
      const clickedInside = this.notificationsPanel.nativeElement.contains(targetElement);
      const clickedButton = this.buttonReference.contains(targetElement)
      if (!clickedInside && !clickedButton) {
        this.isNotificationsPanelExpanded.emit(false);
      }  
    }
  }
}
