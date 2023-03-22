import { Component, Input } from '@angular/core';
import { Message } from 'src/app/shared/models/IMessage';
import { IPerson } from 'src/app/shared/models/IPerson';

@Component({
  selector: 'app-conversation-bubble-type-animation[chatRecipient]',
  templateUrl: './conversation-bubble-type-animation.component.html',
  styleUrls: ['./conversation-bubble-type-animation.component.scss']
})
export class ConversationBubbleTypeAnimationComponent {
  @Input() chatRecipient: IPerson|undefined;
}
