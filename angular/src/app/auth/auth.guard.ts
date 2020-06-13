import { AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Injectable, OnInit, OnDestroy } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate{
  isAuth: boolean = false;

  constructor( private authService: AuthService,
               private router: Router,
               private route: ActivatedRoute) {  }

  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
      this.isAuth = this.authService.getIsAuth();
      this.authService.getIsAuthListener()
        .subscribe( auth => {
          this.isAuth = auth;
          this.router.navigate(['/post/home']);
          return false;
        } );
      if ( !this.isAuth ) {
          return true;
        }
      this.router.navigate(['/post/home']);
      return false;
  }
}
