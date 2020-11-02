import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading =false;
  constructor(private authService :AuthService) { }

  ngOnInit(): void {
  }
  onSignUp(signUpForm :NgForm){
    if(signUpForm.invalid)
      return;

    this.authService.createUser(signUpForm.value.email,signUpForm.value.password);

  }
}
