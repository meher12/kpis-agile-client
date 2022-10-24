import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { Sprint } from 'src/app/models/sprint.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { utils, writeFile } from 'xlsx';
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

   /* Pagination */
   page: number = 1;
   count: number = 0;
   tableSize: number = 4;
   tableSizes: any = [3, 6, 9, 12];

   csvSprint = [];

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
        let objectElement = { "reference": "", "title": "" };
        for (const data of Object.values(this.sprints)) {
          objectElement.reference = data.sReference
          objectElement.title = data.stitre
          this.csvSprint.push(Object.assign({}, objectElement))
        }

        console.log(this.csvSprint);
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', 'Choose project to display list of sprints now is: ' + this.msgError, 'warning')
          console.error(this.msgError);
        });
  }

   /* Pagination */
   onTableDataChange(event: any) {
    this.page = event;
    this.cgetAllSprintsByProjectRef();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.cgetAllSprintsByProjectRef();
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
