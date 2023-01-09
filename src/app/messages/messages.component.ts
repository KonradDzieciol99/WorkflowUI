import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  messagesForm: FormGroup = new FormGroup({
    search: new FormControl<string>('',[]),
  });
  constructor() {
  }
  ngOnInit(): void {
    this.messagesForm.controls['search'].valueChanges.subscribe(value=>{
      
    })
  }
}
