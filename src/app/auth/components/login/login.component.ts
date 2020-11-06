import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit ,OnDestroy {

  isLoading =false;
  private authStatusSubscription : Subscription;
  constructor(private authService :AuthService) { }
 
  ngOnInit() {
    this.authStatusSubscription = this.authService.getAuthStatusListener()
      .subscribe(authStaus => {
          // meaning there is an error
          this.isLoading = false;
      });
  }
  onLogin(loginForm :NgForm){

    if(loginForm.invalid)
    return;

    this.isLoading=true;
    this.authService.login(loginForm.value.email, loginForm.value.password);
  }
  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }
}
