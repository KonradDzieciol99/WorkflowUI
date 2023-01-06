import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'WorkflowUI';
  showHeader = false;
  showSidebar = false;
  showFooter = false;

  constructor(private router: Router,private activatedRoute: ActivatedRoute ) {
  }
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = this.activatedRoute.firstChild?.snapshot.data['showHeader']!== false ? this.showHeader=true:this.showHeader=false;
        this.showSidebar = this.activatedRoute.firstChild?.snapshot.data['showSidebar']!== false ? this.showSidebar=true:this.showSidebar=false;
        this.showFooter = this.activatedRoute.firstChild?.snapshot.data['showFooter']!== false ? this.showFooter=true:this.showFooter=false;
      }
    });
  }

}
