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
  selectedListOption;
  searchRef;

  tasks: Task[];
  story: Story;

  msgError = "";
  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;
  showDevBoard = false;
  roles: string[] = [];

  /* Pagination */
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];

  /* Search by Reference */
  taskListSearched?: {};
  currentTask: Task[] = [];
  currentIndex = -1;
  searchSTReference = '';

  refStoryAfterRefresh?: string;
  getHtmlArray;

  constructor(private storyService: StoryService, private router: Router, private tokenStorageService: TokenStorageService,
    private taskService: TaskService) { }


  ngOnInit(): void {

    /*  if (!localStorage.getItem('task_data')) { 
       localStorage.setItem('task_data', 'no reload') 
       location.reload() 
     } else {
       localStorage.removeItem('task_data') 
     } */

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');
      this.showDevBoard = this.roles.includes('ROLE_DEVELOPER');

      this.getTitleStory();
      this.cgetAllTask();
      this.selected = true;
      this.tableSize = 5;


    }
  }

  //  get all Tasks
  cgetAllTask() {
    this.taskService.getAllTasks()
      .subscribe(data => {
        this.tasks = data;
        // console.log(this.tasks);
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
    this.cgetAllTask();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.cgetAllTask();
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

    this.selectedListOption = true;
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
    if (this.selectedListOption) {
      this.router.navigate(['updatetask', id]);
    }
    else {
      Swal.fire('Hey!', 'Select Story first', 'warning');
    }
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

  // search by story refrence
  findTaskByStoryReference(): void {
    this.currentTask = [];
    this.currentIndex = -1;


    if (this.searchSTReference === "") {
      Swal.fire('Hey!', 'Choose story to display task list', 'warning')
    }
    else {
      this.storyService.findTaskByStoryReference(this.searchSTReference)
        .subscribe(
          data => {
            this.taskListSearched = data;
            console.log(data);
            if (this.taskListSearched) {
              this.selectedListOption = true;
              this.getHtmlArray = true;
              //get story ref
              this.storyService.getStoryByReference(this.searchSTReference)
                .subscribe(data => {
                  this.story = data;
                  console.log(this.story);
                  // send story ref
                  this.taskService.changeSTReference(this.story.stReference);
                })
            }
            else {
              this.getHtmlArray = false;
              //localStorage of ref project
              localStorage.setItem("refstory", this.searchSTReference);
              console.log("Before refresh " + this.searchSTReference)

              Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to create a new task?",
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
                    title: 'You can click on add task button',
                    showConfirmButton: false,
                    timer: 1550
                  }).then((confirm) => {
                    if (confirm) {

                      this.refStoryAfterRefresh = localStorage.getItem("refstory");
                      console.log("After frersh " + this.refStoryAfterRefresh)
                      //get project ref
                      //get story ref
                      this.storyService.getStoryByReference(this.refStoryAfterRefresh)
                        .subscribe(data => {
                          this.story = data;
                          console.log(this.story);
                          // send story ref
                          this.taskService.changeSTReference(this.story.stReference);
                        })
                    }
                    else {
                      console.log("There is no story refernce")
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

}
