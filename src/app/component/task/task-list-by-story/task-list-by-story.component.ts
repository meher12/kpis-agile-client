import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Story } from 'src/app/models/story.model';
import { Task } from 'src/app/models/task.model';
import { StoryService } from 'src/app/services/story/story.service';
import { TaskService } from 'src/app/services/task/task.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-list-by-story',
  templateUrl: './task-list-by-story.component.html',
  styleUrls: ['./task-list-by-story.component.css']
})
export class TaskListByStoryComponent implements OnInit {

 
  //Get value in component 2
  _getsselectedSTRef: any;
  //Getter and Setters
  get getsselectedSTRef() { return this._getsselectedSTRef };
  set getselectedSTRef(value: string) { //debugger;
    this._getsselectedSTRef = value;
  }

  msgError = "";
  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;
  roles: string[] = [];


  tasks: Task[];
  story: Story;
  id: number;

  store_ref_story
  store_ref;


  constructor(private storyService: StoryService, private taskService: TaskService, private router: Router, 
    private tokenStorageService: TokenStorageService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.store_ref_story = this.route.snapshot.params['refstory'];
      //localStorage of ref project
      localStorage.setItem("refStory", this.store_ref_story);
      this.store_ref = localStorage.getItem("refStory");

      this.getRefStory()
      this.getTitleStory()
      this.cgetAllTaskByStoryRef()
    }
  }

   // Get storyRef 
   getRefStory() {
    this.storyService.currentrefSprint
      .subscribe(storyRef => {
        this._getsselectedSTRef = storyRef;
      }); //<= Always get current value!
  }

  // Get All projects by ref id
  getTitleStory() {
    this.storyService.getStoryByReference(this.store_ref_story)
      .subscribe(data => {
        this.story = data;
      })
      console.log("*Ref st*"+this.store_ref)
  }

  // find task by story reference
  cgetAllTaskByStoryRef() {
    this.taskService.getAllTaskByStoryRef(this.store_ref)
      .subscribe(data => {
        this.tasks = data;
        // console.log(this.sprints);
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', 'Choose story to display list of task now is: ' + this.msgError, 'warning')
          console.error(this.msgError);
        });
  }

   // navigate to update sprint
   updateTask(id: number) {
    this.router.navigate(['updatetask', id]);
  }

   // navigate to deatils task story
   detailsTask(id: number) {
    this.router.navigate(['detailtask', id]);
  }

    // delete task by Id
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
  
          this.taskService.deleteTask(id)
            .subscribe(data => {
              console.log(data);
              this.cgetAllTaskByStoryRef();
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
            'Your imaginary task is safe :)',
            'error'
          )
        }
      })
    }
  
  
    // delete all Task By storyId
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
  
            this.taskService.deleteAllTaskByStoryId(this.story.id)
              .subscribe(data => {
                console.log(data);
                this.cgetAllTaskByStoryRef();
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
