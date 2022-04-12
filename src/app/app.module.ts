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
import { ListStoryBySprintComponent } from './component/story/list-story-by-sprint/list-story-by-sprint.component';
import { DetailsStoryComponent } from './component/story/details-story/details-story.component';
import { UpdateStoryComponent } from './component/story/update-story/update-story.component';
import { CreateTaskComponent } from './component/task/create-task/create-task.component';
import { TaskListByStoryComponent } from './component/task/task-list-by-story/task-list-by-story.component';
import { UpdateTaskComponent } from './component/task/update-task/update-task.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { VelocityChartComponent } from './charts/velocity/velocity-chart/velocity-chart.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BurndownComponent } from './charts/burndown/burndown.component';
import { AddSpCompletedComponent } from './component/sprint/add-sp-completed/add-sp-completed.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReleaseBurndownComponent } from './charts/release-burndown/release-burndown.component';
import { TaskDetailsComponent } from './component/task/task-details/task-details.component';
import { SpDoneByProjectComponent } from './charts/sp-done-by-project/sp-done-by-project.component';
import { TaskStatuscChartComponent } from './charts/task-statusc-chart/task-statusc-chart.component';
import { EfficacityDataComponent } from './component/projet/efficacity-data/efficacity-data.component';
import { EfficacityChartComponent } from './charts/efficacity-chart/efficacity-chart.component';
import { CurrentSpInProjectChartComponent } from './charts/current-sp-in-project-chart/current-sp-in-project-chart.component';
import { CommitmentSpInProjectChartComponent } from './charts/commitment-sp-in-project-chart/commitment-sp-in-project-chart.component';
import { RadarSattusTaskChartComponent } from './charts/radar-sattus-task-chart/radar-sattus-task-chart.component';
import { JacocoParseComponent } from './component/jacoco-parse/jacoco-parse.component';
import { UploadFilesComponent } from './component/upload-files/upload-files.component';








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
    ListStoryBySprintComponent,
    DetailsStoryComponent,
    UpdateStoryComponent,
    CreateTaskComponent,
    TaskListByStoryComponent,
    UpdateTaskComponent,
    VelocityChartComponent,
    BurndownComponent,
    AddSpCompletedComponent,
    ReleaseBurndownComponent,
    TaskDetailsComponent,
    SpDoneByProjectComponent,
    TaskStatuscChartComponent,
    EfficacityDataComponent,
    EfficacityChartComponent,
    CurrentSpInProjectChartComponent,
    CommitmentSpInProjectChartComponent,
    RadarSattusTaskChartComponent,
    JacocoParseComponent,
    UploadFilesComponent,



  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgApexchartsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule


  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
