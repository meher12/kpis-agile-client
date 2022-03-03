import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-projet-list',
  templateUrl: './projet-list.component.html',
  styleUrls: ['./projet-list.component.css']
})
export class ProjetListComponent implements OnInit {

  isLoggedIn = false;
  roles: string[] = [];
  msgError = "";
  projects: Projet[];
  constructor(private projectService: ProjectService, private tokenStorageService: TokenStorageService, private router:  Router){ }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
   /*  if (this.isLoggedIn)  {*/
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
     // if( this.roles.includes('ROLE_PRODUCTOWNER')){ 
       
        this.getAllProject();
      /* }

      else{
        this.gotToProjectList()
      } */
      
  }

 /*  gotToProjectList() {
    this.router.navigate(['/home']);
  } */

 
  getAllProject() {
    this.projectService.getProjectList()
      .subscribe(data => {
        this.projects = data;
        console.log(data);
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        }
         
      )
  }

    // navigate to page update employee
    updateProject(id: number) {
      this.router.navigate(['/updateproject', id]);
    }

}
