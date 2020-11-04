import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './../auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private tokenTimer;
  // this variable to notify component , that are not intiated it, they will not listen to any notification we made
  // so we store the notification ; so that they could know what happend
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private httpClient: HttpClient , private router:Router) { }
  getToken() {
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  // other component can call  this method to listen to chagne
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authdata: AuthData = {
      email: email,
      password: password
    }
    this.httpClient.post("http://localhost:3000/api/user/signup", authdata)
      .subscribe(response => {
        // console.log(response);
      })
  }
  login(email: string, password: string) {
    const authdata: AuthData = {
      email: email,
      password: password
    }
    this.httpClient.post<{ token: string , expiresIn:number }>("http://localhost:3000/api/user/login", authdata)
      .subscribe(response => {
        this.token = response.token;

        if (this.token) {
          const expiresInDuration = response.expiresIn;
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresInDuration);

          this.authStatusListener.next(true);
          this.isAuthenticated = true;
          this.router.navigate(["/"]);
        }
      })

  }

  logout() {
    this.isAuthenticated = false;
    this.token = null;
    this.authStatusListener.next(false);
    this.router.navigate(["/"]);

    clearTimeout(this.tokenTimer);

  }
}
