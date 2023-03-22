import { Component, Input } from '@angular/core';
import { Message } from 'src/app/shared/models/IMessage';

@Component({
  selector: 'app-message[message][currentRecipientEmail][isMyMessage][isStartMessage][isEndMessage][isLastRead]',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() message: Message|undefined;
  @Input() currentRecipientEmail: string|undefined;
  @Input() isMyMessage: boolean|undefined;
  @Input() isStartMessage: boolean|undefined;
  @Input() isEndMessage: boolean|undefined;
  @Input() isLastRead: boolean|undefined;

}
