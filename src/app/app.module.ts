import { AuthInterceptorService } from './auth/services/auth-interceptor.service';
import {ErrorInterceptor} from './error-interceptor'
import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule ,FormsModule} from '@angular/forms'
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'

import {AngularMaterialModule} from './angular-material/angular-material.module'

import {PostListComponent } from './posts/post-list/post-list.component';
import { HeaderComponent } from './header/header.component';


import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import {ErrorComponent} from'./error/error.component'

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
   

    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS ,useClass: AuthInterceptorService ,multi :true},
    {provide: HTTP_INTERCEPTORS ,useClass: ErrorInterceptor ,multi :true}

  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents:[
    ErrorComponent
  ]
})
export class AppModule { }
