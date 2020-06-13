import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Register } from './models/registerAuth.model';
import { changePas} from './models/changePass.model';
import { LocalStorageService } from './../shared/services/localStorage.service';
import { LoginAuth } from './models/loginAuth.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authToken: string;
  private verificationtoken: string;
  private expireTime: number;
  private email: string;
  private username: string;
  private userId: string;
  private role:string;
  private rememberMe: boolean;
  private tokenTimer: any;
  private isVerified = false;
  private isAuthenticted = false;
  private isAuthenticatedListner = new Subject<boolean>();
  private usernameListener = new Subject<string>();

  constructor( private http: HttpClient,private router: Router,private localStorageService: LocalStorageService,private toastr: ToastrService ) { }

  

  getToken() {
    return this.authToken;
  }
  getIsAuth() {
    return this.isAuthenticted;
  }
  getIsAuthListener() {
    return this.isAuthenticatedListner.asObservable();
  }
  getUsernameListener() {
    return this.usernameListener.asObservable();
  }
  
  getRole()
  {
    return this.role;
  }
  getUserId() {
    return this.userId;
  }
  getEmail() {
    return this.email;
  }
  getIsVerified() {
    return this.isVerified;
  }
  getUsername() {
    return this.username;
  }


  registerUser( newUser: Register ) {
    this.http.post<{message: string, userData:{ username: string, email: string, password: string } }>('http://localhost:3000/auth/register', newUser)
      .subscribe( result => {
        this.router.navigate(['/login']);
        this.toastr.success('Email sent Please verify...');
      }, error => {
        console.log("Error is:-",error);
        console.log('sign up failed');
         
      });
  }

login( loginUser: LoginAuth ) {
    this.http.post<{token: string, expiresIn: number, userId: string, username: string,role:string ,email: string, message: string}>('http://localhost:3000/auth/login', loginUser)
      .subscribe( result => {
        this.toastr.success("logged in successfully");
        
        this.expireTime = result.expiresIn;
        this.authToken = result.token;
        this.email = result.email;
        this.role = result.role;
        this.userId = result.userId;
        this.rememberMe = loginUser.rememberMe;
        this.isAuthenticatedListner.next(true);
        this.username = result.username;
        this.isAuthenticted = true;
        const now = new Date();
        const expirationDate = new Date(now.getTime() + (this.expireTime * 1000));
        this.setAuthTimer(result.expiresIn);
        this.localStorageService.saveAuthInfo(result.token, result.username, result.userId, expirationDate, result.email, loginUser.rememberMe,result.role);
        this.router.navigate(['/post/home']);
      }, error => {
        console.log(error);
        this.toastr.error(error.error.message,error.error.errCode , {
          timeOut: 3000
        });
       
      });
  }

  changePass(email:string,oldPassword:string,newPassword:string)
  {
    const changepass : changePas={email:email,oldPassword:oldPassword,newPassword:newPassword};
    return this.http.post('http://localhost:3000/auth/changPassword',changepass).subscribe(
      res=>{
          this.toastr.success("Password changed");
      }
    );
  }
   
emailVerify( email: string, emailToken: string ) {
    return this.http.post<{message: string}>( 'http://localhost:3000/auth/verify/' + email,{ token: emailToken } );
  }


forgetPassword( email: string ) {
    this.http
      .post<{message: string}>('http://localhost:3000/auth/forgetPassword/' + email,'')
      .subscribe( result => {
        console.log(result.message);
        if(result)
        this.toastr.success("mail sent successfully")
        else{
          this.toastr.warning('Some error occured')
        }
      } );
  }

resetPassword(password: string, emailId: string, token: string) {
    const email = emailId;
    this.http
      .post<{isError:string, message: string }>('http://localhost:3000/auth/resetPassword/' + email, { password: password, token: token })
      .subscribe( result => {
        if(result.isError){
          this.toastr.error(result.message);
        }
        else{
        this.toastr.success(result.message);
        this.router.navigate(['/login']);
        }
        
      } );
  }

autoLoadUser() {
    const authInfo = this.localStorageService.getAuthInfo();
    if ( this.localStorageService.getRememberMe() === 'false' || this.localStorageService.getRememberMe() === 'null' ) {
      this.logout();
    } else {
      const now = new Date();
      const expiresIn = authInfo.expireDuration.getTime() - now.getTime();
      if ( expiresIn > 0 ) {
        this.authToken = authInfo.token;
        this.isAuthenticted = true;
        this.username = authInfo.username;
        this.userId = authInfo.userId;
        this.email = authInfo.email;
        this.setAuthTimer( expiresIn / 1000 );
        this.isAuthenticatedListner.next(true);
      }
    }
  }

  setAuthTimer(duration: number) {
    console.log('setting Timer: ', duration );
    this.tokenTimer = setTimeout( () => {
      this.logout();
    }, duration * 1000 );
  }

  getUser( email: string ) {
    return this.http
      .get<{ email: string, username: string }>( 'http://localhost:3000/auth/getUser/' + email);
  }

  updateUser(user: Register, email: string ) {
    this.http
      .put( 'http://localhost:3000/auth/updateUser/' + email, user )
        .subscribe( result => {
       
          this.router.navigate(['']);
          this.username = user.username;
          if ( this.isAuthenticted === true ) {
            this.localStorageService.setUsername( user.username );
          }
          this.usernameListener.next(user.username);
        } );
  }

  logout() {
    clearTimeout(this.tokenTimer);
    this.localStorageService.removeAuthInfo();
    this.isAuthenticatedListner.next(false);
    this.isAuthenticted = false;
    this.username = 'User Name';
    this.router.navigate(['/login']);
  }

}
