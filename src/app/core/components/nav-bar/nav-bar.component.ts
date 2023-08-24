import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PresenceService } from 'src/app/shared/services/presence.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  isNumberOfOnlineUsersTooltipVisible:boolean;
  isCollapsed:boolean;
  notificationsLength$: Observable<number>;
  numberOfOnlineUsers$: Observable<number>;
  constructor(private readonly presenceService : PresenceService){
    this.isCollapsed = true;
    this.isNumberOfOnlineUsersTooltipVisible=false;

      this.notificationsLength$ = this.presenceService.notifications$.pipe(
        map(x=>{ return x.filter(n=>!n.displayed).length})
      );

      this.numberOfOnlineUsers$ = this.presenceService.onlineUsers$.pipe(
        map(x=>x.length)
      );
   }
}
