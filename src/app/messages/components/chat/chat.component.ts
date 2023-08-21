import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, filter, fromEvent, of, startWith, switchMap, take } from 'rxjs';
import { IUser } from 'src/app/shared/models/IUser';
import { MessagesService } from '../../messages.service';
import { ChatService } from '../../services/chat.service';
import { Message } from 'src/app/shared/models/IMessage';

@Component({
  selector: 'app-chat[chatRecipient]',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input("chatRecipient") chatRecipient?: IUser;
  messageContent: FormControl<string | null>
  loading: boolean;
  isloadingOlderMessages:boolean;
  hasMoreData:boolean;
  indexOfLastDisplayed?:number;
  @ViewChildren('messages') messages?: QueryList<ElementRef>;
  @ViewChild('chat') chat?: ElementRef<HTMLDivElement>;
  @ViewChild('formInput') formInput?: ElementRef;
  
  constructor(public chatService:ChatService){
      this.messageContent = new FormControl('Hello');
      this.loading=false;
      this.isloadingOlderMessages=false;
      this.hasMoreData=true;
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
    this.chatService.messageThread$.pipe(
      filter((messages): messages is Message[] => messages !== undefined),
    ).subscribe(x=>{
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
    // fromEvent(window, 'resize')
    // .pipe(
    //   debounceTime(100)
    // )
    // .subscribe((x) => {
    //   console.log(x)
    
    // });
  }
  private hasScrolledOnce = false;
  ngAfterViewInit() {
    if (this.messages) {
      this.messages.changes.pipe().subscribe(() => this.scrollToBottom("auto"));
    }
  }
  scrollToBottom = (behavior:ScrollBehavior) => {
    if (!this.chat) 
      return;
    
    const element = this.chat.nativeElement;

    const totalHeightHowFarUserIsFromTheTopInPx = element.scrollHeight - element.scrollTop - element.clientHeight
    const isUserAtBottom = totalHeightHowFarUserIsFromTheTopInPx < 200;

    if (!isUserAtBottom && this.hasScrolledOnce)
      return;
    
    element.scroll({
      top: element.scrollHeight,
      left: 0,
      behavior: behavior  
    });

    this.hasScrolledOnce=true;
  }
  sendMessage(chatRecipient:IUser) {
    if (chatRecipient.email && this.messageContent.value) {
      this.loading = true;
      this.chatService.sendMessage(chatRecipient, this.messageContent.value).subscribe({
        next: () => {this.messageContent?.reset();},
        complete: () =>{this.loading = false;} 
    });
    }
  }
  ngOnDestroy(): void {
    this.chatService.stopHubConnectionAndDeleteMessageThread();
  }

  loadMoreMessages(){
    this.isloadingOlderMessages=true;

    this.chatService.getMessages(this.chatRecipient!,15).pipe(take(1)).subscribe((messages)=>{
      
      if (messages.length<15) 
        this.hasMoreData=false;
      
      this.isloadingOlderMessages=false;
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (!this.hasMoreData) 
      return;

    if (!this.chat) 
      return;
    
    if (this.chat && this.chat.nativeElement.scrollTop === 0) 
      this.loadMoreMessages()
    
  }
}
