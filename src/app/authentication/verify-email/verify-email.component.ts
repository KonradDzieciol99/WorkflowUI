import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  email:string;

  constructor(private authenticationService: AuthenticationService, private activatedRoute: ActivatedRoute) {
    this.email = this.activatedRoute.snapshot.queryParams['email'];
  }
  ngOnInit(): void {
    
  }
  send(){
    this.authenticationService.resendVerificationEmail(this.email).pipe(take(1)).subscribe(()=>{

    });
  }

}
