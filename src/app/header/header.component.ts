import { Subscription } from 'rxjs';
import { AuthService } from './../auth/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) { }
  isUserAuthenticated = false;
  private changeTokenSubscription: Subscription;

  ngOnInit(): void {
    // to update on reload
    this.isUserAuthenticated = this.authService.getIsAuth();
    // to update on the flow
    this.changeTokenSubscription = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.isUserAuthenticated = isAuthenticated;
    });
  }

  onLogout(){
    this.authService.logout();
  }
  ngOnDestroy(): void {
    this.changeTokenSubscription.unsubscribe();
  }

}
