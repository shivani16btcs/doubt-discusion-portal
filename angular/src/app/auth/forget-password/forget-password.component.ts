import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  isSubmitted = false;
  showValidError = false;
  form: FormGroup;

  constructor( private authService: AuthService ) { }

  ngOnInit(): void {
    const emailRegEx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
    this.form = new FormGroup({
      email: new FormControl( null , { validators: [Validators.required, Validators.pattern(emailRegEx)] })
    });
  }

  onForgetPassword() {
    if ( this.form.invalid ) {
      this.showValidError = true;
      return;
    }
    this.isSubmitted = true;
    this.showValidError = false;
    this.authService.forgetPassword( this.form.value.email );
  }

  closePopUp() {
    this.isSubmitted = false;
  }


}
