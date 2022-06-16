import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sprint } from 'src/app/models/sprint.model';
import { Story } from 'src/app/models/story.model';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-sprint-details',
  templateUrl: './sprint-details.component.html',
  styleUrls: ['./sprint-details.component.css']
})
export class SprintDetailsComponent implements OnInit {

  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;
  roles: string[] = [];
  msgError = "";

  id: number;
  sprint: Sprint;
  stories: Story[];

  idealLine: string[];
  workedLine: string[];
  dayinsprint: string[];

  displayStyle = "none";

  constructor(private sprintService: SprintService, private route: ActivatedRoute,
    private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {

    if (!localStorage.getItem('sprint_data')) { 
      localStorage.setItem('sprint_data', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('sprint_data') 
    }

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.sprint = new Sprint();
      this.id = this.route.snapshot.params['id'];
      //localStorage.setItem('id', this.id.toString());
      this.sprintService.getSprintById(this.id)
        .subscribe(data => {
          this.sprint = data;
          this.stories = this.sprint.stories;

          // arrays of brundown chart
          this.sprint.idealLinearray.pop();
          this.idealLine = this.sprint.idealLinearray;

          this.sprint.workedlarray.pop();
          this.workedLine = this.sprint.workedlarray;

          this.sprint.daysarray.pop();
          this.dayinsprint = this.sprint.daysarray;

          console.log(this.sprint);

        },
          err => {
            this.msgError = err.error.message;
            Swal.fire('Hey!', this.msgError, 'warning');
            console.error(this.msgError);
          });

      this.updateTablesprint();
      this.daysNumberInSprint();
      this.idealLineForSprint();
    }
  }

  
  updateTablesprint() {
     this.sprintService.updateStoryPointInSprint()
       .subscribe(data => console.log(data));
   }
  //  get number of days in sprint
  daysNumberInSprint() {
    this.sprintService.daysInSprint()
      .subscribe(data => console.log(data));
  }

  //  get number of days in sprint
  idealLineForSprint() {
    this.sprintService.idealLineOfSprint()
      .subscribe(data => console.log(data));
  }


  openPopup(id: number) {
    this.router.navigate([{ outlets: { addspPopup: ['addspcompleted', id] } }]);
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
    this.router.navigate([{ outlets: { addspPopup: null } }]);
  }



}
