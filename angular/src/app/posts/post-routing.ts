import { AuthGuard } from './../auth/auth.guard';
import { LoginComponent } from './../auth/login/login.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'home', component: PostsListComponent },
  { path: 'home/:postId', component: PostsListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class PostRouting {

}
