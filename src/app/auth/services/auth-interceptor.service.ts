import { AuthService } from './auth.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService :AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // throw new Error('Method not implemented.');
    const authToken = this.authService.getToken();
    const clonedRequest = req.clone({
      headers: req.headers.set("Authorization",`Bearer ${ authToken}`)  // add new header to the request header
    });
    console.log("token is injected in the request");

    return next.handle(clonedRequest);
  }
}
