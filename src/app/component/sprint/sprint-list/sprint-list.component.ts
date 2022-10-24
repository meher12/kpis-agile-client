import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { Sprint } from 'src/app/models/sprint.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { utils, writeFile } from 'xlsx';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-sprint-list',
  templateUrl: './sprint-list.component.html',
  styleUrls: ['./sprint-list.component.css']
})
export class SprintListComponent implements OnInit {

  projects: Projet[];
  selected;
  selectedListOption;
  searchRef;

  sprints: Sprint[];
  project: Projet;

  msgError = "";
  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;

  roles: string[] = [];


  /* Pagination */
  page: number = 1;
  count: number = 0;
  tableSize: number = 4;
  tableSizes: any = [3, 6, 9, 12];

  /* Search by title */
  sprintsList?: Sprint[];
  currentSprint: Sprint[] = [];
  currentIndex = -1;
  searchPReference = '';

  refProjForRefresh?: string;
  getArray;

  csvSprint = [];


  constructor(private sprintService: SprintService, private router: Router, private tokenStorageService: TokenStorageService,
    private projectService: ProjectService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.getTitleProjects();
      this.cgetAllSprints();
      this.selected = true;

      this.tableSize = 4;

    }
  }


  //  get all Sprints
  cgetAllSprints() {
    this.sprintService.getAllSprints()
      .subscribe(data => {
        this.sprints = data;
        //console.log(this.sprints
      },

        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        });
  }

  /* Pagination */
  onTableDataChange(event: any) {
    this.page = event;
    this.cgetAllSprints();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.cgetAllSprints();
  }


  // Get All projects
  getTitleProjects() {
    this.projectService.getProjectList()
      .subscribe(data => {
        this.projects = data;
      })
  }
  /* ******* */

  // find sprint by project reference
  cgetAllSprintsByProjectRef(event: any) {

    this.selectedListOption = true;
    //Set refprodect in component 1
    this.sprintService.changePReference(event.target.value);


    //get project name
    this.projectService.getProjectByReference(event.target.value)
      .subscribe(data => {
        this.project = data;
      })

    this.sprintService.getAllSprintsByProjectRef(event.target.value)
      .subscribe(data => {
        this.sprints = data;
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', 'Choose project to display list of sprints now is: ' + this.msgError, 'warning')
          console.error(this.msgError);
        });
  }


  // navigate to update sprint
  updateSprint(id: number) {
    if (this.selectedListOption) {
      this.router.navigate(['updatesprint', id]);
    }
    else {
      Swal.fire('Hey!', 'Select Project first', 'warning');
    }
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
            this.cgetAllSprints();
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

          this.sprintService.deleteAllSprintByProjectId(this.project.id)
            .subscribe(data => {
              console.log(data);
              this.cgetAllSprints();
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


  searchSprintListByProjectRef(): void {
    this.currentSprint = [];
    this.currentIndex = -1;


    if (this.searchPReference === "") {
      Swal.fire('Hey!', 'Choose project to display sprints list', 'warning')
    }
    else {
      this.projectService.findSprintByProjectReference(this.searchPReference)
        .subscribe(data => {
          this.sprintsList = data;
          console.log(data);

          if (this.sprintsList) {
            this.selectedListOption = true;
            this.getArray = true;

            let objectElement = { "reference": "", "title": "" };
            for (const data of Object.values(this.sprintsList)) {
              objectElement.reference = data.sReference
              objectElement.title = data.stitre
              this.csvSprint.push(Object.assign({}, objectElement))
            }
    
            console.log(this.csvSprint);

            //get project ref
            this.projectService.getProjectByReference(this.searchPReference)
              .subscribe(data => {
                this.project = data;
                // send project ref
                this.sprintService.changePReference(this.searchPReference);
              })
          }
          else {
            this.getArray = false;
            //localStorage of ref project
            localStorage.setItem("refproject", this.searchPReference);
            console.log("Before refresh"+this.searchPReference)

            Swal.fire({
              title: 'Are you sure?',
              text: "Do you want to create a new sprint?",
              icon: 'info',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, create it!'
            }).then((result) => {
              if (result.isConfirmed) {

                this.selectedListOption = true;
               
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'You can click on add sprint button',
                  showConfirmButton: false,
                  timer: 1550
                }).then((confirm) => {
                  if (confirm) {
                    
                  this.refProjForRefresh = localStorage.getItem("refproject");
                  console.log("After frersh "+this.refProjForRefresh)
                  //get project ref
                  this.projectService.getProjectByReference(this.refProjForRefresh)
                    .subscribe(data => {
                      this.project = data;
                      // send project ref
                      this.sprintService.changePReference(this.refProjForRefresh);
                    })
                  }
                  else{
                    console.log("There is no project refernce")
                  }
                });
              }
            })

          }
        },
          err => {
            this.msgError = err.error.message;
            Swal.fire('Hey!', 'Error: ' + this.msgError, 'error')
            console.error(this.msgError);
          });
    }

  }


  handleExport() {
    const headings = [[
      'Reference',
      'Title',

    ]];
    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, this.csvSprint, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'List');


    //****************choose format file*********************** */

    const items = [
      { id: "CSV type", name: "CSV" },
      { id: "XLSX type", name: "XLSX" },

    ]

    const inputOptions = new Map
    items.forEach(item => inputOptions.set(item.id, item.name))

    Swal.fire({
      title: 'Select file format',
      input: 'radio',
      inputOptions: inputOptions,
      showDenyButton: true, showCancelButton: true,
      confirmButtonText: `Export`,
      denyButtonText: `Don't export`,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to choose something!'
        }
        if (value === "CSV type") {
          // Swal.fire({ html: `You selected: ${value}` })
          writeFile(wb, 'List.csv');
        }
        if (value === "XLSX type") {
          // Swal.fire({ html: `You selected: ${value}` })
          writeFile(wb, 'List.xlsx');
        }
      }
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('File exported!', 'List.csv', 'success')
      } else if (result.isDenied) {
        Swal.fire('File are not exported', 'List.xlsx', 'info')
      }
    });
  }

}
