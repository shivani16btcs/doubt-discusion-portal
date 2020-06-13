import { LocalStorageService } from './../../shared/services/localStorage.service';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth: Subscription;
  isAuthenticated = false;
  username = 'User Name';
  dropDownStatus = 'My Profile';

  constructor( private authService: AuthService,
               private commonService: CommonService,
               private localStorageService: LocalStorageService ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuth();
    this.isAuth = this.authService.getIsAuthListener()
      .subscribe( auth => {
        this.isAuthenticated = auth;
        
        if ( !auth ) {
          this.username = 'User Name';
        }

        if ( localStorage.getItem('username') ) {
          this.username = this.localStorageService.getUsername();
        } else {
          this.username = this.authService.getUsername();
        }
      } );
    if ( this.isAuthenticated ) {
        this.username = this.localStorageService.getUsername();
        this.username = this.authService.getUsername();
      }

    this.authService.getUsernameListener()
      .subscribe( newUsername => {
        this.username = newUsername;
      } );
  }

  dropDown() {
    if ( this.dropDownStatus === 'My Profile' ) {
      this.commonService.myProfileListener.next( true );
    } else {
      this.dropDownStatus = 'My Profile';
      this.commonService.myProfileListener.next( false );
    }
  }
  
  onLogout() {
    this.authService.logout();
    this.username = 'User Name';
  }

  ngOnDestroy() {
    this.isAuth.unsubscribe();
  }

}
