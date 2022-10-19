import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sprint } from 'src/app/models/sprint.model';
import { Story } from 'src/app/models/story.model';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { StoryService } from 'src/app/services/story/story.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-story-by-sprint',
  templateUrl: './list-story-by-sprint.component.html',
  styleUrls: ['./list-story-by-sprint.component.css']
})
export class ListStoryBySprintComponent implements OnInit {



  //Get value in component 2
  _getsselectedSRef: any;
  //Getter and Setters
  get getsselectedSRef() { return this._getsselectedSRef };
  set getselectedSRef(value: string) { //debugger;
    this._getsselectedSRef = value;
  }

  msgError = "";
  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;
  roles: string[] = [];


  stories: Story[];
  sprint: Sprint;
  id: number;

  store_local_ref_sprint;

  store_ref_sprint;
  ref;

   /* Pagination */
   page: number = 1;
   count: number = 0;
   tableSize: number = 4;
   tableSizes: any = [3, 6, 9, 12];

  constructor(private storyService: StoryService, private sprintService: SprintService, private router: Router, 
    private tokenStorageService: TokenStorageService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    // Reload story list after 2000 ms
    /* setTimeout(() => {
       if (!localStorage.getItem('story_data')) { 
      localStorage.setItem('story_data', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('story_data') 
    }
  }, 2000);  */
   
// Get Role
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.store_ref_sprint = this.route.snapshot.params['refsprint'];
      //localStorage of ref project
     localStorage.setItem("refsprint", this.store_ref_sprint);
     this.ref= localStorage.getItem("refsprint"); 

      this.getRefSprint()
      this.getTitleSprint()
      this.cgetAllStoryBySprintRef()
    }
  }

  // Get projectRef in create sprint from sprint list
  getRefSprint() {
    this.storyService.currentrefSprint
      .subscribe(sprintRef => {
        this._getsselectedSRef = sprintRef;
      }); //<= Always get current value!
  }

  // Get All projects by ref id
  getTitleSprint() {
    this.sprintService.getSprintByReference(this.store_ref_sprint)
      .subscribe(data => {
        this.sprint = data;
      })
     console.log("*Ref sp*"+this._getsselectedSRef)
  }

  // find sprint by project reference
  cgetAllStoryBySprintRef() {
   // this.storyService.getAllStoryBySprintRef(this.store_local_ref_sprint)
   this.storyService.getAllStoryBySprintRef( this.ref /* this._getsselectedSRef */)
      .subscribe(data => {
        this.stories = data;
        // console.log(this.sprints);
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', 'Choose sprint to display list of story now is: ' + this.msgError, 'warning')
          console.error(this.msgError);
        });
  }


     /* Pagination */
     onTableDataChange(event: any) {
      this.page = event;
      this.cgetAllStoryBySprintRef();
    }
    onTableSizeChange(event: any): void {
      this.tableSize = event.target.value;
      this.page = 1;
      this.cgetAllStoryBySprintRef();
    }
    

  // navigate to update sprint
  updateStory(id: number) {
    this.router.navigate(['updatestory', id]);
  }

  detailStory(id: number) {
    this.router.navigate(['detailsstory', id]);
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

        this.storyService.deleteStory(id)
          .subscribe(data => {
            console.log(data);
            this.cgetAllStoryBySprintRef();
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
              this.cgetAllStoryBySprintRef();
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
