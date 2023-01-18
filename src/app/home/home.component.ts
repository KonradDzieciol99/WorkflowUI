import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private auth0Service:AuthService,private homeService:HomeService) {
    
  }
  ngOnInit(): void {
  this.auth0Service.isAuthenticated$.subscribe(x=>{
    console.log(x);
  })

  }
  test(){
    this.homeService.test().subscribe(x=>{
      console.log(x);
    })
  }

}
