import { AuthInterceptorService } from './auth/services/auth-interceptor.service';
import {ErrorInterceptor} from './error-interceptor'
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import {AngularMaterialModule} from './angular-material/angular-material.module'
import {PostsModule} from './posts/posts.module'

import { HeaderComponent } from './header/header.component';

import {ErrorComponent} from'./error/error.component'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostsModule,
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
