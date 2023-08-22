import { Component, Input } from '@angular/core';
import { IUser } from 'src/app/shared/models/IUser';

@Component({
  selector: 'app-conversation-bubble-type-animation[chatRecipient]',
  templateUrl: './conversation-bubble-type-animation.component.html',
  styleUrls: ['./conversation-bubble-type-animation.component.scss']
})
export class ConversationBubbleTypeAnimationComponent {
  @Input() chatRecipient?: IUser;
}
