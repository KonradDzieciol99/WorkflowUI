import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesRoutingModule } from './messages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MessagesComponent } from './messages.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ChatComponent } from './components/chat/chat.component';
import { MessageComponent } from './components/message/message.component';
import { ConversationBubbleTypeAnimationComponent } from './components/conversation-bubble-type-animation/conversation-bubble-type-animation.component';


@NgModule({
  declarations: [
    MessagesComponent,
    ChatComponent,
    MessageComponent,
    ConversationBubbleTypeAnimationComponent
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    SharedModule,
    AccordionModule.forRoot(), 
    TooltipModule.forRoot(),
   
  ]
})
export class MessagesModule { }
