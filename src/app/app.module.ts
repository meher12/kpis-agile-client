import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

// search module
//import { Ng2SearchPipeModule } from 'ng2-search-filter';

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
import { ProjetListComponent } from './component/projet/projet-list/projet-list.component';
import { UpdateProjetComponent } from './component/projet/update-projet/update-projet.component';
import { ProjetDetailsComponent } from './component/projet/projet-details/projet-details.component';
import { SprintListComponent } from './component/sprint/sprint-list/sprint-list.component';
import { UpdateSprintComponent } from './component/sprint/update-sprint/update-sprint.component';
import { SprintDetailsComponent } from './component/sprint/sprint-details/sprint-details.component';
import { SprintListByProjectComponent } from './component/sprint/sprint-list-by-project/sprint-list-by-project.component';
import { StoryListComponent } from './component/story/story-list/story-list.component';
import { TaskListComponent } from './component/task/task-list/task-list.component';
import { CreateStoryComponent } from './component/story/create-story/create-story.component';







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
    ProjetListComponent,
    UpdateProjetComponent,
    ProjetDetailsComponent,
    SprintListComponent,
    UpdateSprintComponent,
    SprintDetailsComponent,
    SprintListByProjectComponent,
    StoryListComponent,
    TaskListComponent,
    CreateStoryComponent,



  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    //Ng2SearchPipeModule


  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
