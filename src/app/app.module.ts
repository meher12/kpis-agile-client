import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BoardPoComponent } from './board-po/board-po.component';
import { BoardScrmComponent } from './board-scrm/board-scrm.component';
import { BoardDevComponent } from './board-dev/board-dev.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { authInterceptorProviders } from './services/auth-interceptor.service';
import { CreateSprintComponent } from './component/sprint/create-sprint/create-sprint.component';
import { CreateProjetComponent } from './component/projet/create-projet/create-projet.component';


@NgModule({
  declarations: [
    AppComponent,
    BoardPoComponent,
    BoardScrmComponent,
    BoardDevComponent,
    SigninComponent,
    SignupComponent,
    ProfileComponent,
    HomeComponent,
    CreateSprintComponent,
    CreateProjetComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
