import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Efficacity, Projet } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-efficacity-chart',
  templateUrl: './efficacity-chart.component.html',
  styleUrls: ['./efficacity-chart.component.scss']
})
export class EfficacityChartComponent implements OnInit {

  project: Projet = new Projet();
  projects: Projet[];


  pSpwrkedF: string[] = [];
  sprintName: String[] = [];

  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;

  roles: string[] = [];

  msgError = "";
  selected;
  id: number;

  newEfficacityArrays: Efficacity;
 


  displayStyle = "none";

  constructor(private projectService: ProjectService, private tokenStorageService: TokenStorageService, private router: Router) { }


  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.getAllproject();

    }
  }

  getAllproject() {
    this.projectService.getProjectList()
      .subscribe(data => {
        this.projects = data;
      },
        err => {
          this.msgError = err.error.message;
          console.error(this.msgError);
        });
  }

  //  get release Brundown Chart project reference
  getModelByProjectRef(event: any) {
    this.projectService.getProjectByReference(event.target.value)
      .subscribe({
        next: (data) => {
          this.project = data;
         // console.log("----",this.project);
         // this.id = this.project.id;
         // console.log("----",this.id);
        },
        error: err => {
          this.msgError = err.error.message;
          console.error(this.msgError)
        }
      });
  }

    //get velocity info
    getInfoEfficacity(event: Efficacity){

      this.newEfficacityArrays = event;

      console.log("New Velocity ***********", this.newEfficacityArrays.FloatArr);
    }
  openPopup(id: number) {
  //  this.router.navigate([{ outlets: { efficacityPopup: ['efficacitydata', this.id] } }]);
    this.displayStyle = "block";
  }

  closePopup() {
    this.displayStyle = "none";
    //this.router.navigate([{ outlets: { efficacitydataPopup: null } }]);
  }

}
