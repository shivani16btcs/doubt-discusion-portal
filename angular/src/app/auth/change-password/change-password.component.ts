import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';



@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  isSubmitted = false;
  showValidError = false;
  form: FormGroup;

   
constructor(private authService:AuthService) { }
  ngOnInit(): void {
  }

  

  changeSubmit()
  {
  if(this.form.invalid){
      this.showValidError = true;
      return;
    }
    console.log(this.form.value);
   this.authService.changePass(this.form.value.email,this.form.value.oldPassword,this.form.value.newPassword);
  }

}
