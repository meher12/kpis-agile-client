import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Story } from 'src/app/models/story.model';
import { Task } from 'src/app/models/task.model';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { StoryService } from 'src/app/services/story/story.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-details-story',
  templateUrl: './details-story.component.html',
  styleUrls: ['./details-story.component.css']
})
export class DetailsStoryComponent implements OnInit {

  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;
  showDevBoard  = false;
  roles: string[] = [];
  msgError = "";

  id: number;
  story: Story;
  tasks: Task[];

  constructor(private storyService: StoryService,  private route: ActivatedRoute,
    private tokenStorageService: TokenStorageService, private sprintService: SprintService) { }

  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');
      this.showDevBoard = this.roles.includes('ROLE_DEVELOPER');

      this.story = new Story();
      this.id = this.route.snapshot.params['id'];
      this.storyService.getStoryById(this.id)
        .subscribe(data => {
          this.story = data;
          this.tasks = this.story.tasks;
          console.log(this.story);

        },
          err => {
           this.msgError = err.error.message;
           Swal.fire('Hey!', this.msgError, 'warning');
          console.error(this.msgError);
          });

          this.updateTablesprint();
    }
  }

  updateTablesprint() {
    this.sprintService.updateStoryPointInSprint()
      .subscribe(data => console.log(data));
  }

}
