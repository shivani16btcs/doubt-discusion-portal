import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.css']
})
export class EmailVerifyComponent implements OnInit {
  constructor( private authService: AuthService,private route: ActivatedRoute,private router: Router ) {}

  ngOnInit(): void {
    let email: string;
    let emailToken: string;
    
    this.route.params.subscribe( value => {
      email = value.emailId;
    } );
    this.route.queryParams.subscribe( value => {
      emailToken = value.token;
    } );
    console.log(email + " " + emailToken);
    this.authService.emailVerify( email, emailToken  )
      .subscribe( result => {
        console.log(result.message);
      } );
  }

}
