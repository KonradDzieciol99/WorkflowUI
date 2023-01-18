import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private homeService:HomeService) {
  }
  ngOnInit(): void {

  }
  test(){
    this.homeService.getWeather().subscribe(x=>{
      console.log(x);
    })
  }
}
