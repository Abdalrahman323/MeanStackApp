import { Component, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading =false;
  constructor(private authService :AuthService) { }

  ngOnInit(): void {
  }
  onLogin(loginForm :NgForm){

    if(!loginForm.invalid)
    this.authService.login(loginForm.value.email, loginForm.value.password);
  }
}
