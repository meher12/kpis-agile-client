import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { Sprint } from 'src/app/models/sprint.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-sprint-list-by-project',
  templateUrl: './sprint-list-by-project.component.html',
  styleUrls: ['./sprint-list-by-project.component.css']
})
export class SprintListByProjectComponent implements OnInit {


  //Get value in component 2
  _getsselectedPRef: any;
  //Getter and Setters
  get getsselectedPRef() { return this._getsselectedPRef };
  set getselectedPRef(value: string) { //debugger;
    this._getsselectedPRef = value;
  }

  msgError = "";
  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;
  roles: string[] = [];


  sprints: Sprint[];
  project: Projet;
  id: number;

  store_ref_project;
  ref_proj


  constructor(private sprintService: SprintService, private projectService: ProjectService, private router: Router,
     private tokenStorageService: TokenStorageService, private route: ActivatedRoute ) { }

  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.store_ref_project = this.route.snapshot.params['refproject'];
      //localStorage of ref project
     localStorage.setItem("refproject", this.store_ref_project);
     this.ref_proj = localStorage.getItem("refproject");



      this.getRefProject()
      this.getTitleProjects()
      this.cgetAllSprintsByProjectRef()
    }
  }

  // Get projectRef in create sprint from sprint list
  getRefProject() {
    this.sprintService.currentrefProject
      .subscribe(projectRef => {
        this._getsselectedPRef = projectRef;
      }); //<= Always get current value!
  }

  // Get All projects by ref id
  getTitleProjects() {
    this.projectService.getProjectByReference(this.ref_proj)
      .subscribe(data => {
        this.project = data;
      })
      console.log("******"+this.ref_proj)
  }

  // find sprint by project reference
  cgetAllSprintsByProjectRef() {
    this.sprintService.getAllSprintsByProjectRef(this.ref_proj)
      .subscribe(data => {
        this.sprints = data;
        // console.log(this.sprints);
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', 'Choose project to display list of sprints now is: ' + this.msgError, 'warning')
          console.error(this.msgError);
        });
  }



  // navigate to update sprint
  updateSprint(id: number) {
    this.router.navigate(['updatesprint', id]);
  }

  detailSprint(id: number) {
    this.router.navigate(['detailssprint', id]);
  }


  // delete project by Id
  confirmDeleteById(id: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Deleted!',
          'Your sprint ' + id + ' has been deleted.',
          'success'
        )

        this.sprintService.deleteSprint(id)
          .subscribe(data => {
            console.log(data);
            this.cgetAllSprintsByProjectRef();
          },
            err => {
              this.msgError = err.error.message;
              Swal.fire('Hey!', this.msgError, 'warning')
              console.error(this.msgError);
            })

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary sprint is safe :)',
          'error'
        )
      }
    })
  }

  // delete all Sprint By projectId
  confirmDeleteAll() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Deleted!',
          'All sprints has been deleted.',
          'success'
        ),

          this.projectService.getProjectByReference(this.ref_proj)
            .subscribe(data => {
              this.project = data;
            })
        this.sprintService.deleteAllSprintByProjectId(this.project.id)
          .subscribe(data => {
            console.log(data);
            this.cgetAllSprintsByProjectRef();
          },
            err => {
              this.msgError = err.error.message;
              Swal.fire('Hey!', this.msgError, 'warning')
              console.error(this.msgError);
            })

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary sprints is safe :)',
          'error'
        )
      }
    })

  }




}
