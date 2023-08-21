import { Component, Input } from '@angular/core';
import { Message } from 'src/app/shared/models/IMessage';
import { IUser } from 'src/app/shared/models/IUser';

@Component({
  selector: 'app-message[message][currentRecipientEmail][isMyMessage][isStartMessage][isEndMessage][isLastRead][currentRecipient]',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() message: Message|undefined;
  @Input() currentRecipientEmail: string|undefined;
  @Input() currentRecipient?: IUser;
  @Input() isMyMessage: boolean|undefined;
  @Input() isStartMessage: boolean|undefined;
  @Input() isEndMessage: boolean|undefined;
  @Input() isLastRead: boolean|undefined;

}
