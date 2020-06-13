import { AuthService } from './../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;

  constructor( private authService: AuthService,
               private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      password: new FormControl(
        null,
        { validators: [Validators.required] }
      ),
      confirmPassword: new FormControl(
        null,
        { validators: [Validators.required] }
      )
    });
  }

  onResetPassword() {
    let email: string;
    let token: string;
    this.route.params.subscribe( value => {
      email = value.emailId;
    } );
    this.route.queryParams.subscribe( value => {
      token = value.token;
    } );
    if ( this.form.invalid ) {
      return;
    }
    if ( this.form.value.password && this.form.value.confirmPassword ) {
      const password = this.form.value.password;
      const confPassword = this.form.value.confirmPassword;
      if (!( password === confPassword )) {
        this.form.patchValue({confirmPassword: null});
      } else {
        this.authService.resetPassword( password, email, token );
      }
    }
   }

}
