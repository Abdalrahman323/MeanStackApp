import { AuthGuardService } from './auth/services/auth-guard.service';
import { PostListComponent } from './posts/components/post-list/post-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule } from '@angular/router'
import { PostCreateComponent } from './posts/components/post-create/post-create.component';
import {AuthModule} from './auth/auth.module'

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
      {path:'',component:PostListComponent},
      {path:'create',component:PostCreateComponent , canActivate:[AuthGuardService]},
      {path:'edit/:postId',component:PostCreateComponent ,  canActivate:[AuthGuardService]},
      // all the routes registerd here will be loaded lazily
      {path:'auth',loadChildren:"./auth/auth.module#AuthModule"}

    ])
  ],
  exports:[
    RouterModule
  ],
  providers:[
    AuthGuardService
  ]
})
export class AppRoutingModule { }
