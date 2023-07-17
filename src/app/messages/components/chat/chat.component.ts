import { Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, of, switchMap, take } from 'rxjs';
import { IUser } from 'src/app/shared/models/IUser';
import { MessagesService } from '../../messages.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat[chatRecipient]',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input("chatRecipient") chatRecipient?: IUser;
  messageContent: FormControl<string | null>
  loading: boolean;
  indexOfLastDisplayed?:number;
  @ViewChildren('messages') messages?: QueryList<ElementRef>;
  @ViewChild('chat') chat?: ElementRef;

  constructor(public chatService:ChatService){
      this.messageContent = new FormControl('Hello');
      this.loading=false;
    }
  ngOnInit(): void {
    this.messageContent.valueChanges.pipe(
      // debounceTime(300),
      // distinctUntilChanged(),
      switchMap((term:string|null)=>{
        if (Boolean(term)) {return this.chatService.userIsTyping().pipe(take(1));}
        return of([]);
      })
    ).subscribe()
    this.chatService.messageThread$.subscribe(x=>{
    //console.log(x.filter(v=>v.senderEmail !== this.currentRecipientEmail && v.dateRead).ind)
      const indexes = [];
      for (let index = 0; index < x.length; index++) {
        if (this.chatRecipient && x[index].senderEmail !== this.chatRecipient.email && x[index].dateRead) {
          //indexes.push(index);//old
          this.indexOfLastDisplayed=index;//new
        }
      }
      // console.log(indexes[indexes.length - 1]); // 👉️ [0, 2, 4]//old
      // if (indexes[indexes.length - 1]) {//old
      //   this.indexOfLastDisplayed=indexes[indexes.length - 1];//old
      // }//old
    });
    // this.messagesService.messageThread$.subscribe(x=>{
    //   x[8].
    // })
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
  sendMessage(chatRecipient:IUser) {
    if (chatRecipient.email && this.messageContent.value) {
      this.loading = true;
      this.chatService.sendMessage(chatRecipient, this.messageContent.value).subscribe({
        next: () => {this.messageContent?.reset();},
        complete: () =>{
          this.loading = false;
          console.info('Wysłano wiadomość');
        } 
    });
    }
  }
  ngOnDestroy(): void {
    this.chatService.stopHubConnectionAndDeleteMessageThread();
  }
  // sendMessage() {
  //   if (this.currentRecipientEmail && this.messageContent.value) {
  //     this.loading = true;
  //     this.messagesService.sendMessage(this.currentRecipientEmail, this.messageContent.value).then(() => {
  //       this.messageContent?.reset();
  //     }).finally(() => this.loading = false);
  //   }
  // }
}
