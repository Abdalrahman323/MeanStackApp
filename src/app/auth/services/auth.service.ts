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
  private tokenTimer: any;
  // this variable to notify component , that are not intiated it, they will not listen to any notification we made
  // so we store the notification ; so that they could know what happend
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private httpClient: HttpClient, private router: Router) { }
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
    this.httpClient.post<{ token: string, expiresIn: number }>("http://localhost:3000/api/user/login", authdata)
      .subscribe(response => {
        this.token = response.token;

        if (this.token) {

          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);

          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          const now = new Date();
          this.setAuthTimer(response.expiresIn);
          const expirationData = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(this.token, expirationData);

          this.router.navigate(["/"]);
        }
      })

  }

  logout() {
    this.isAuthenticated = false;
    this.token = null;
    this.authStatusListener.next(false);

    this.clearAuthData();
    clearTimeout(this.tokenTimer);

    this.router.navigate(["/"]);


  }

  autoAuthenticateUser() {
    // to automatically authenticate the user , if we got the information from the local storage
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    // now we get the token , we need to check if the token still a valid one
    // we can't validate if it's a valid token that only can be done by the server
    // but at least we can tell if it's still valid from expiration perpective
    const now = new Date();

    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;

      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn / 1000);

    }
  }

  private setAuthTimer(duration: number) {

    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);

  }

  private saveAuthData(token: string, expirationData: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationData.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate)
      return;

    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }


}
