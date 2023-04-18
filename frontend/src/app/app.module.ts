import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { authInterceptorProviders } from './_services/auth/auth.interceptor';
import { AuthModule } from './pages/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { PartsModule } from './parts/parts.module';
import { HomeModule } from './pages/home/home.module';
import { BorrowersModule } from './pages/borrowers/borrowers.module';
import { LoansModule } from './pages/loans/loans.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    PartsModule,
    SharedModule,
    HomeModule,
    BorrowersModule,
    LoansModule,
    BrowserAnimationsModule,
    // HttpClientXsrfModule.withOptions({ cookieName: 'csrftoken', headerName: 'X-CSRFToken' }),
  ],
  providers: [ {provide: APP_BASE_HREF, useValue: '/'}, authInterceptorProviders ],
  bootstrap: [AppComponent]
})
export class AppModule { }
