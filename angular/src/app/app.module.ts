import { PostModule } from './posts/post.module';
import { AngularMaterials } from './angular-materials.module';
import { AppRouting } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { HeaderComponent } from './dashboard/header/header.component';
import { FooterComponent } from './dashboard/footer/footer.component';
import { AuthModule } from './auth/auth.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ErrorInterceptor } from './shared/interceptors/error-interceptor';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRouting,
    AngularMaterials,
    PostModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
	  ToastrModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ResetPasswordComponent]
})
export class AppModule { }
