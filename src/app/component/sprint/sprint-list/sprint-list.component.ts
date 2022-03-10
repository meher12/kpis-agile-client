import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { Sprint } from 'src/app/models/sprint.model';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';


import Swal from 'sweetalert2';

@Component({
  selector: 'app-sprint-list',
  templateUrl: './sprint-list.component.html',
  styleUrls: ['./sprint-list.component.css']
})
export class SprintListComponent implements OnInit {

  sprints: Sprint[];


  msgError = "";
  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;

  roles: string[] = [];

  constructor(private sprintService: SprintService, private router: Router, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');
     
      
    }
  }

  // find sprint by project reference
  cgetAllSprintsByProjectRef(event: any) {
    //Set refprodect in component 1
    this.sprintService.changePReference(event.target.value);

    this.sprintService.getAllSprintsByProjectRef(event.target.value)
      .subscribe(data => {
        this.sprints = data;
       // console.log(this.sprints);
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', 'Insert ref project to display list of sprints now is: ' + this.msgError, 'warning')
          console.error(this.msgError);
        });
  }


  // navigate to update sprint
  updateSprint(id: number){
   this.router.navigate(['updatesprint', id]);
  }
















  // // get all Sprints By ProjectId
  /*  cgetAllSprints() {
     this.sprintService.getAllSprints()
       .subscribe(data => {
         this.sprints = data;
         console.log(this.sprints);
         console.log(JSON.parse(JSON.stringify(this.sprints)));
       },
        
         
         err => {
           this.msgError = err.error.message;
           Swal.fire('Hey!', this.msgError, 'warning')
           console.error(this.msgError);
         });
   } */

}





