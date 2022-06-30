import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TeamService } from 'src/app/services/team.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { SizeService } from 'src/app/services/size.service';
import { MatButton } from '@angular/material/button';

@Component({
  
  selector: 'app-inside',
  templateUrl: './inside.component.html',
  styleUrls: ['./inside.component.css']
})
export class InsideComponent implements OnInit {
  @ViewChild('topHeightIdentifier')  topHeightIdentifier: ElementRef;
  @ViewChild('headerButtonIdentifier')  headerButtonIdentifier: MatButton;
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private host: ElementRef,private router: Router,
    private breakpointObserver: BreakpointObserver,
    private teamService:TeamService,private authenticationService:AuthenticationService,
    private sizeService: SizeService) {}

  LogOut(){
    this.authenticationService.logout();
    this.router.navigateByUrl('/')
  }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    // var width = this.myIdentifier.nativeElement.offsetWidth;
    // console.log('Width:' + width);

    this.teamService.GetAll().subscribe();

    const sizeObserver = new ResizeObserver(entries => {
      const height = entries[0].contentRect.height;
      this.sizeService.SetToolbarSize(height);
    });
    sizeObserver.observe(this.topHeightIdentifier.nativeElement);

    
  }

  private isClicked=true;
  sidenavButtonClick(){
    this.isClicked= !this.isClicked;
    this.sizeService.SetButtonState(this.isClicked);
  }
}
