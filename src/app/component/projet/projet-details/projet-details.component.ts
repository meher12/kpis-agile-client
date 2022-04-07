import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { Sprint } from 'src/app/models/sprint.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-projet-details',
  templateUrl: './projet-details.component.html',
  styleUrls: ['./projet-details.component.css']
})
export class ProjetDetailsComponent implements OnInit {


  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;
  roles: string[] = [];
  msgError = "";

  id: number;
  preference: string;
  
  projectdetails: Projet;
  sprintList: Sprint[];


  constructor(private projectService: ProjectService,  private route: ActivatedRoute,
    private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.projectdetails = new Projet();
      this.id = this.route.snapshot.params['id'];
      this.projectService.getProjectById(this.id)
        .subscribe(data => {
          this.projectdetails = data;
          this.sprintList = this.projectdetails.sprints;
         // this.preference = this.projectdetails.pReference;
          //console.log(this.projectdetails);
          //console.log(this.preference);

        },
          err => {
           this.msgError = err.error.message;
           Swal.fire('Hey!', this.msgError, 'warning');
          console.error("*******"+this.msgError);
          });
    }
  }

}
