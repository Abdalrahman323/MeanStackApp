import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    RouterModule.forChild([
      {path:'login',component:LoginComponent},
      {path:'signup',component: SignupComponent}
  ]),
    CommonModule,
    AngularMaterialModule,
    FormsModule
  ],
  exports:[
    RouterModule
  ]
})
export class AuthModule { }
