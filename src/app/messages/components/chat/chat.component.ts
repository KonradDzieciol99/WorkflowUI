import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IPerson } from 'src/app/shared/models/IPerson';
import { MessagesService } from '../../messages.service';

@Component({
  selector: 'app-chat[currentRecipientEmail]',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input("currentRecipientEmail") currentRecipientEmail!: string;
  oAuthService: any;
  messageContent: FormControl<string | null>
  loading: boolean;
  indexOfLastDisplayed:number|undefined;

  @ViewChildren('messages') messages: QueryList<ElementRef> | undefined;
  @ViewChild('chat') chat: ElementRef | undefined;

  constructor(public messagesService:MessagesService,private toastrService: ToastrService){
      this.messageContent = new FormControl('Hello');
      this.loading=false;
    }
  ngOnInit(): void {
    this.messagesService.messageThread$.subscribe(x=>{
    //console.log(x.filter(v=>v.senderEmail !== this.currentRecipientEmail && v.dateRead).ind)
      const indexes = [];
      for (let index = 0; index < x.length; index++) {
        if (x[index].senderEmail !== this.currentRecipientEmail && x[index].dateRead) {
          indexes.push(index);
        }
      }
      console.log(indexes[indexes.length - 1]); // 👉️ [0, 2, 4]
      if (indexes[indexes.length - 1]) {
        this.indexOfLastDisplayed=indexes[indexes.length - 1];
      }
    });
    // this.messagesService.messageThread$.subscribe(x=>{
    //   x[8].
    // })
    let date = new Date();
    date.toString()
  }
  ngAfterViewInit() {
    this.scrollToBottom();
    if (this.messages) {
      this.messages.changes.subscribe(this.scrollToBottom);
    }
  }
  scrollToBottom = () => {
    if (this.chat) {
      try {
        this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
      } catch (error) {
        throw error;
      }
    }
  }
  sendMessage() {
    if (this.currentRecipientEmail && this.messageContent.value) {

      this.loading = true;
      this.messagesService.sendMessage(this.currentRecipientEmail, this.messageContent.value).then(() => {
        this.messageContent?.reset();
      }).finally(() => this.loading = false);

    }
  }
}
