import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardDevComponent } from './board-dev/board-dev.component';
import { BoardPoComponent } from './board-po/board-po.component';
import { BoardScrmComponent } from './board-scrm/board-scrm.component';
import { CreateProjetComponent } from './component/projet/create-projet/create-projet.component';
import { ProjetDetailsComponent } from './component/projet/projet-details/projet-details.component';
import { ProjetListComponent } from './component/projet/projet-list/projet-list.component';
import { UpdateProjetComponent } from './component/projet/update-projet/update-projet.component';
import { CreateSprintComponent } from './component/sprint/create-sprint/create-sprint.component';
import { SprintListComponent } from './component/sprint/sprint-list/sprint-list.component';
import { UpdateSprintComponent } from './component/sprint/update-sprint/update-sprint.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'dev', component: BoardDevComponent },
  { path: 'scrm', component: BoardScrmComponent },
  { path: 'po', component: BoardPoComponent },

// Project Router
  {path: 'projectList', component: ProjetListComponent},
  {path: 'createproject', component: CreateProjetComponent},
  {path: 'detailsproject/:id', component: ProjetDetailsComponent},
  {path: 'updateproject/:id', component: UpdateProjetComponent},

  // Sprint Router
  {path: 'sprintList', component: SprintListComponent},
  {path: 'createsprint', component: CreateSprintComponent},
  {path: 'updatesprint/:id', component: UpdateSprintComponent},
  
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }