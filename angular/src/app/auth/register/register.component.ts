import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AuthService } from './../auth.service';
import { Register } from './../models/registerAuth.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
//import { NotificationService } from '../utility/notification.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  confirmPasswordError = false;
  password = 'Enter your password';
  confirmPassword = 'Re-Enter your password';
  submitButton = 'Register';

  constructor( private authService: AuthService,
               private route: ActivatedRoute,
               private router: Router
             ) { }

  ngOnInit(): void {
    const emailRegEx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
    this.form = new FormGroup({
      password: new FormControl(
        null,
        { validators: [Validators.required] }
      ),
      confirmPassword: new FormControl(
        null,
        { validators: [Validators.required] }
      ),
      email: new FormControl(
        null,
        { validators: [Validators.required, Validators.pattern(emailRegEx)] }
      ),
      firstName: new FormControl(
        null,
        { validators: [Validators.required] }
      ),
      secondName: new FormControl( '' ),
      termsCheck: new FormControl(
        null,
        { validators: [Validators.required]}
      )
    });

    this.route.paramMap
      .subscribe( (paramMap: ParamMap) => {
        if ( paramMap.has('emailId') ) {
          this.authService.getUser( paramMap.get('emailId') )
            .subscribe( user => {
              this.password = 'Enter your new password';
              this.confirmPassword = 'Re-Enter your new password';
              this.submitButton = 'Update';
              
this.form.patchValue(
                {
                  email: user.email,
                  firstName: user.username.split(' ')[0],
                  secondName: user.username.split(' ')[1]
                });
            } );
        }
      } );

  }

  onRegister() {
    this.checkPassword();
    if ( this.form.invalid ) {
      return;
    } else {
      const user: Register = {
        username: this.form.value.firstName +' '+ this.form.value.secondName,
        password: this.form.value.password,
        email: this.form.value.email
      };
      if ( this.submitButton === 'Register' ) {
        this.authService.registerUser( user );
      } else {
        this.authService.updateUser( user, this.authService.getEmail() );
      }
    }
  }

  checkPassword() {
    if ( this.form.value.password && this.form.value.confirmPassword ) {
      const password = this.form.value.password;
      const confPassword = this.form.value.confirmPassword;
      if (!( password === confPassword )) {
        this.form.patchValue({confirmPassword: null});
        this.confirmPasswordError = true;
      } else {
        this.confirmPasswordError = false;
      }
    }

  }

}
