import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sprint } from 'src/app/models/sprint.model';
import { Story } from 'src/app/models/story.model';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { StoryService } from 'src/app/services/story/story.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { utils, writeFile } from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.css']
})
export class StoryListComponent implements OnInit {


  sprints: Sprint[];
  selected;
  selectedListOption;
  searchRef;

  stories: Story[];
  sprint: Sprint;

  msgError = "";
  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;
  showDevBoard = false;
  roles: string[] = [];

  /* Pagination */
  page: number = 1;
  count: number = 0;
  tableSize: number = 4;
  tableSizes: any = [3, 6, 9, 12];

  /* Search by title */
  storyList?: Story[];
  currentStory: Story[] = [];
  currentIndex = -1;
  searchSReference = '';

  refSprintAfterRefresh?: string;
  getHtmlArray;

  csvStory = [];

  constructor(private storyService: StoryService, private router: Router, private tokenStorageService: TokenStorageService,
    private sprintService: SprintService) { }

  ngOnInit(): void {

    /*  if (!localStorage.getItem('story_data')) { 
       localStorage.setItem('story_data', 'no reload') 
       location.reload() 
     } else {
       localStorage.removeItem('story_data') 
     } */

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    //update SP call 
    this.updateTablesprint();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');
      this.showDevBoard = this.roles.includes('ROLE_DEVELOPER');

      // this.getTitleSprint();
      this.cgetAllStory();
      this.selected = true;
      this.tableSize = 4;

    }
  }

  // update SP
  updateTablesprint() {
    this.sprintService.updateStoryPointInSprint()
      .subscribe(data => console.log(data));
  }


  //  get all Story
  cgetAllStory() {

    this.storyService.getAllStory()
      .subscribe(data => {
        this.stories = data;
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        }
      );
  }

  /* Pagination */
  onTableDataChange(event: any) {
    this.page = event;
    this.cgetAllStory();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.cgetAllStory();
  }


  // Get All Sprint for select option
  getTitleSprint() {
    this.sprintService.getAllSprints()
      .subscribe(data => {
        this.sprints = data;
      })
  }

  // find story by sprint reference
  cgetAllStoryBySprintRef(event: any) {

    this.selectedListOption = true;
    //Set refprodect in component 1
    this.storyService.changeSReference(event.target.value);


    //get sprint name
    this.sprintService.getSprintByReference(event.target.value)
      .subscribe(data => {
        this.sprint = data;
      })

    this.storyService.getAllStoryBySprintRef(event.target.value)
      .subscribe(data => {
        this.stories = data;
       // console.log(this.stories);
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', 'Choose sprint to display list of story now is: ' + this.msgError, 'warning')
          console.error(this.msgError);
        });
  }


  // navigate to update story
  updateStory(id: number) {
    if (this.selectedListOption) {
      this.router.navigate(['updatestory', id]);
    }
    else {
      Swal.fire('Hey!', 'Select Sprint first', 'warning');
    }
  }

  detailStory(id: number) {
    this.router.navigate(['detailsstory', id]);
  }


  // delete story by Id
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
          'Your story ' + id + ' has been deleted.',
          'success'
        )

        this.storyService.deleteStory(id)
          .subscribe(data => {
            console.log(data);
            this.cgetAllStory();
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
          'Your imaginary story is safe :)',
          'error'
        )
      }
    })
  }

  // delete all Story By sprintId
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
          'All stories has been deleted.',
          'success'
        ),

          this.storyService.deleteAllStoryBySprintId(this.sprint.id)
            .subscribe(data => {
              console.log(data);
              this.cgetAllStory();
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

  findStoryBySprintReference(): void {
    this.currentStory = [];
    this.currentIndex = -1;


    if (this.searchSReference === "") {
      Swal.fire('Hey!', 'Choose sprint to display story list', 'warning')
    }
    else {
      this.sprintService.findStoryBySprintReference(this.searchSReference)
        .subscribe(
          data => {
            this.storyList = data;
            console.log(data);
            if (this.storyList) {
              this.selectedListOption = true;
              this.getHtmlArray = true;

              let objectElement = { "reference": "", "title": "" };
              for (const data of Object.values(this.storyList)) {
                objectElement.reference = data.stReference
                objectElement.title = data.stname
                this.csvStory.push(Object.assign({}, objectElement))
              }
      
              console.log(this.csvStory);
              //get project ref
              this.sprintService.getSprintByReference(this.searchSReference)
                .subscribe(data => {
                  this.sprint = data;
                  console.log(this.sprint);
                  // send sprint ref
                  this.storyService.changeSReference(this.sprint.sReference);

                })
            }
            else {
              this.getHtmlArray = false;
              //localStorage of ref project
              localStorage.setItem("refsprint", this.searchSReference);
              console.log("Before refresh " + this.searchSReference)

              Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to create a new story?",
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
                    title: 'You can click on add story button',
                    showConfirmButton: false,
                    timer: 1550
                  }).then((confirm) => {
                    if (confirm) {

                      this.refSprintAfterRefresh = localStorage.getItem("refsprint");
                      console.log("After frersh " + this.refSprintAfterRefresh)
                      //get sprint ref
                      this.sprintService.getSprintByReference(this.searchSReference)
                        .subscribe(data => {
                          this.sprint = data;
                          console.log(this.sprint);
                          // send sprint ref
                          this.storyService.changeSReference(this.sprint.sReference);

                        })
                    }
                    else {
                      console.log("There is no sprint refernce")
                    }
                  });
                }
              })

            }
          },
          err => {
            this.msgError = err.error.message;
            Swal.fire('Hey!', 'error: ' + this.msgError, 'warning')
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
    utils.sheet_add_json(ws, this.csvStory, { origin: 'A2', skipHeader: true });
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
