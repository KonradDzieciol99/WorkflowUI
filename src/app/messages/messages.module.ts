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
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionFindPeopleComponent } from './components/accordion-find-people/accordion-find-people.component';
import { AccordionMyChatsComponent } from './components/accordion-my-chats/accordion-my-chats.component';
import { AccordionInvitationsComponent } from './components/accordion-invitations/accordion-invitations.component';

@NgModule({
  declarations: [
    MessagesComponent,
    ChatComponent,
    MessageComponent,
    ConversationBubbleTypeAnimationComponent,
    AccordionFindPeopleComponent,
    AccordionMyChatsComponent,
    AccordionInvitationsComponent,
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    SharedModule,
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    InfiniteScrollModule,
    ReactiveFormsModule,
    FormsModule,
    CollapseModule.forRoot(),
  ],
})
export class MessagesModule {}
