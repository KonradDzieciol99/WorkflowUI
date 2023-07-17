import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PresenceService } from 'src/app/shared/services/presence.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy  {

  isNumberOfOnlineUsersTooltipVisible=false;
  isCollapsed:boolean = true;
  notificationsLength$: Observable<number>;
  numberOfOnlineUsers$: Observable<number>;
  constructor(private readonly presenceService : PresenceService){

      this.notificationsLength$=this.presenceService.notifications$.pipe(
        map(x=>{ return x.filter(n=>n.displayed==false).length})
      );
      this.numberOfOnlineUsers$=this.presenceService.onlineUsers$.pipe(map(x=>x.length));
   }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
