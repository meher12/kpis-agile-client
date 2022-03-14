import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Story } from 'src/app/models/story.model';
import { Task } from 'src/app/models/task.model';
import { StoryService } from 'src/app/services/story/story.service';
import { TaskService } from 'src/app/services/task/task.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  stories: Story[];
  selected;

  tasks: Task[];
  story: Story;

  msgError = "";
  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;
  roles: string[] = [];

  constructor(private storyService: StoryService, private router: Router, private tokenStorageService: TokenStorageService,
    private taskService: TaskService) { }


  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.getTitleStory();
      this.cgetAllTask();

    }
  }

  //  get all Tasks
  cgetAllTask() {
    this.taskService.getAllTasks()
      .subscribe(data => {
        this.tasks = data;
        console.log(this.tasks);
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        });
  }

  // Get Stories for select option
  getTitleStory() {
    this.storyService.getAllStory()
      .subscribe(data => {
        this.stories = data;
      })
  }

  // find tasks by story reference
  cgetAllTaskByStoryRef(event: any) {

    //Set refprodect in component 1
    this.taskService.changeSTReference(event.target.value);


    //get story name
    this.storyService.getStoryByReference(event.target.value)
      .subscribe(data => {
        this.story = data;
      })

    this.taskService.getAllTaskByStoryRef(event.target.value)
      .subscribe(data => {
        this.tasks = data;
        console.log(this.tasks);
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', 'Choose story to display list of tasks now is: ' + this.msgError, 'warning')
          console.error(this.msgError);
        });
  }

  // navigate to update story
  updateTask(id: number) {
    this.router.navigate(['updatetask', id]);
  }

  detailTask(id: number) {
    this.router.navigate(['detailstask', id]);
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
            this.cgetAllTask();
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
              this.cgetAllTask();
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
