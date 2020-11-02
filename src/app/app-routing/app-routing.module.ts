import { PostListComponent } from './../posts/post-list/post-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes } from '@angular/router'
import { PostCreateComponent } from '../posts/post-create/post-create.component';
import { LoginComponent } from '../auth/components/login/login.component';
import { SignupComponent } from '../auth/components/signup/signup.component';

// const routes: Routes =[
//   {path:'',component:PostListComponent},
//   {path:'create',component:PostCreateComponent}
// ]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(
    [
      {path:'login',component:LoginComponent},
      {path:'signup',component: SignupComponent},
      {path:'',component:PostListComponent},
      {path:'create',component:PostCreateComponent},
      {path:'edit/:postId',component:PostCreateComponent}

    ])
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
