import { AuthService } from './../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoginAuth } from '../models/loginAuth.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  
constructor( private authService: AuthService , private toastr: ToastrService ) { }
  ngOnInit(): void {
     const emailRegEx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
   // const emailRegEx = '^[a-zA-Z0-9_\-\.]+@[a-zA-Z0-9_\-\.]+\.[a-zA-Z]{2,5}$';
    this.form = new FormGroup({
      email: new FormControl(null,
        { validators: [Validators.required, Validators.pattern(emailRegEx)] }),
      password: new FormControl(
        null,{ validators: [Validators.required] }
      ),
      rememberMe: new FormControl(
        null,
      )
    });
  }
 

  onLogin() {
    if (this.form.invalid) {
      return;
    }
    const loginUser: LoginAuth = {
            email: this.form.value.email,
            password: this.form.value.password,
            rememberMe: this.form.value.rememberMe
    };
   
    this.authService.login( loginUser );
   
  }

}
