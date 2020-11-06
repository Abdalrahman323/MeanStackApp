import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSubscription: Subscription;
  constructor(private authService: AuthService) { }


  ngOnInit() {
    this.authStatusSubscription = this.authService.getAuthStatusListener()
      .subscribe(authStaus => {
          // meaing there is an error
          this.isLoading = false;
      });
  }
  onSignUp(signUpForm: NgForm) {
    if (signUpForm.invalid)
      return;
    this.isLoading = true;
    this.authService.createUser(signUpForm.value.email, signUpForm.value.password);

  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }
}
