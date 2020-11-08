import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './../auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment'

const Backend_URL = environment.apiURL +'/user'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private tokenTimer: any;
  private userId : string;
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

  getUserId(){
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authdata: AuthData = {
      email: email,
      password: password
    }
    this.httpClient.post(Backend_URL+"/signup", authdata)
      .subscribe(() => {
        this.router.navigate(["/"]);
      },error =>{
        this.authStatusListener.next(false);
      });
  }
  login(email: string, password: string) {
    const authdata: AuthData = {
      email: email,
      password: password
    }
    this.httpClient.post<{ token: string, userId:string, expiresIn: number  }>
    (Backend_URL+"/login", authdata)
      .subscribe(response => {
        this.token = response.token;

        if (this.token) {

          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.userId = response.userId;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          const now = new Date();
          this.setAuthTimer(response.expiresIn);
          const expirationData = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(this.token, expirationData ,this.userId);

          this.router.navigate(["/"]);
        }
      },error =>{
        this.authStatusListener.next(false);
      })

  }

  logout() {
    this.isAuthenticated = false;
    this.token = null;
    this.authStatusListener.next(false);
    this.userId = null;

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
    //  we need to check if the token still a valid one
    // we can't validate if it's a valid token that only can be done by the server
    // but at least we can tell if it's still valid from expiration perpective
    const now = new Date();

    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId

      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn / 1000);

    }
  }

  private setAuthTimer(duration: number) {

    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);

  }

  private saveAuthData(token: string, expirationData: Date , userId:string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationData.toISOString());
    localStorage.setItem("userId",userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");

  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId =localStorage.getItem("userId");
    if (!token || !expirationDate)
      return;

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }


}
