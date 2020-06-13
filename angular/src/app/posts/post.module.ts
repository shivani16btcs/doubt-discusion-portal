import { PostRouting } from './post-routing';
import { NgModule } from '@angular/core';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularMaterials } from '../angular-materials.module';
import { AppRouting } from '../app-routing.module';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [
    PostsListComponent,
    PostCreateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularMaterials,
    PostRouting,
    NgxPaginationModule
  ],
})
export class PostModule {

}
