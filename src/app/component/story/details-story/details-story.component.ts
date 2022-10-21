import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Story } from 'src/app/models/story.model';
import { Task } from 'src/app/models/task.model';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { StoryService } from 'src/app/services/story/story.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import * as moment from 'moment';  
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
  taskSorted: any[] = [];

    //Get value in component 2
    _sselectedSRef: any;
    //Getter and Setters
    get selectedSRef() { return this._sselectedSRef };
    set selectedSRef(value: string) { //debugger;
      this._sselectedSRef= value;
    }

  constructor(private storyService: StoryService,  private route: ActivatedRoute,
    private tokenStorageService: TokenStorageService, private router: Router, private sprintService: SprintService) { }

  ngOnInit(): void {

   /*  if (!localStorage.getItem('story_data')) { 
      localStorage.setItem('story_data', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('story_data') 
    } */

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
         // this.tasks = this.story.tasks;
          console.log(this.story);
            //*************** */
            var taskNotStored = this.story.tasks;
            // sort sprints array
            this.taskSorted = taskNotStored.sort((a, b) => {
              return moment(a.tdateDebut).diff(b.tdateDebut);
            });
            //**************** */

        },
          err => {
           this.msgError = err.error.message;
           Swal.fire('Hey!', this.msgError, 'warning');
          console.error(this.msgError);
          });

          this.updateTablesprint();
          this.getRefSprint();
    }
  }

  updateTablesprint() {
    this.sprintService.updateStoryPointInSprint()
      .subscribe(data => console.log(data));
  }


   // Get projectRef in create sprint from sprint list
   getRefSprint() {
    this.storyService.currentrefSprint
      .subscribe(sprintRef => {
        this._sselectedSRef = sprintRef;
      }); //<= Always get current value!
  }

  sendRefSprintParams(){
    //Set refprodect in component 1
    this.storyService.changeSReference(this._sselectedSRef);
      
  }
  
  gotToStoryListBysref() {
    this.router.navigate(['storylistByspr', this._sselectedSRef]);
  }

}
