import { AuthData } from './../auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient :HttpClient) { }

  createUser(email:string,password:string){
    const authdata:AuthData = {
      email:email,
      password:password
    }
    this.httpClient.post("http://localhost:3000/api/user/signup",authdata)
    .subscribe(response =>{
      console.log(response);
    })
  }
  login(email :string , password :string){
    const authdata:AuthData = {
      email:email,
      password:password
    }
    this.httpClient.post("http://localhost:3000/api/user/login",authdata)
    .subscribe(response => {
      console.log(response);

    })

  }
}
