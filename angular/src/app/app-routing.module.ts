import { EmailVerifyComponent } from './auth/email-verify/email-verify.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '',
    children: [
  {path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  {path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  {path: 'changePassword', component: ChangePasswordComponent},
  { path: 'register/:emailId', component: RegisterComponent},
  { path: 'forgetPassword', component: ForgetPasswordComponent,canActivate: [AuthGuard] },
  { path: 'resetPassword/:emailId', component: ResetPasswordComponent},
  { path: 'verify/:emailId', component: EmailVerifyComponent, canActivate: [AuthGuard] }
    ] },
  { path: 'post', loadChildren: () => import('./posts/post.module').then( m => m.PostModule ) } ,
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRouting {

}
