import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TeamService } from 'src/app/services/team.service';
import {Team } from 'src/app/models/Team.model'
import {concatMap} from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loading = false;
  submitted = false;
  returnUrl!: string;
  RegisterForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private router: Router, private authenticationService: AuthenticationService, private teamService: TeamService) { }

  ngOnInit(): void {
    this.RegisterForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  onSubmit() {

    const val = this.RegisterForm.value;
    this.submitted = true;

    if (this.RegisterForm.invalid) 
    {
      return;
    }

    //this.loading = true;
    let Team:Team = {name:val.email};
    this.authenticationService.Register(val.email, val.password).pipe(
      concatMap(() => { return this.teamService.CreateTeam(Team)})
    ).subscribe((response) => {
      this.router.navigateByUrl('/inside');
      console.log("User is Registered in...");
      });
  }
}
