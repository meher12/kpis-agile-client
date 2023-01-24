import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Story } from 'src/app/models/story.model';
import { Task } from 'src/app/models/task.model';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { StoryService } from 'src/app/services/story/story.service';
import { TaskService } from 'src/app/services/task/task.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { utils, writeFile } from 'xlsx';
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
  showDevBoard = false;
  roles: string[] = [];


  tasks: Task[];
  story: Story;
  id: number;

  store_ref_story
  store_ref;
  csvTask = [];

  /* Pagination */
  page: number = 1;
  count: number = 0;
  tableSize: number = 4;
  tableSizes: any = [3, 6, 9, 12];

  constructor(private storyService: StoryService, private taskService: TaskService, private router: Router,
    private tokenStorageService: TokenStorageService, private route: ActivatedRoute, private sprintService: SprintService) { }

  ngOnInit(): void {

    /* if (!localStorage.getItem('task_data')) { 
      localStorage.setItem('task_data', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('task_data') 
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

      this.store_ref_story = this.route.snapshot.params['refstory'];
      //localStorage of ref project
      localStorage.setItem("refStory", this.store_ref_story);
      this.store_ref = localStorage.getItem("refStory");

      this.getRefStory()
      this.getTitleStory()
      this.cgetAllTaskByStoryRef()
      this.tableSize = 5;
    }
  }

  // update SP
  updateTablesprint() {
    this.sprintService.updateStoryPointInSprint()
      .subscribe(data => console.log(data));
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
    console.log("*Ref st*" + this.store_ref)
  }

  // find task by story reference
  cgetAllTaskByStoryRef() {
    this.taskService.getAllTaskByStoryRef(this.store_ref)
      .subscribe(data => {
        this.tasks = data;

        let objectElement = { "reference": "", "title": "" };
        for (const data of Object.values(this.tasks)) {
          objectElement.reference = data.tReference
          objectElement.title = data.tname
          this.csvTask.push(Object.assign({}, objectElement))
        }
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', 'Choose story to display list of task now is: ' + this.msgError, 'warning')
          console.error(this.msgError);
        });
  }

  /* Pagination */
  onTableDataChange(event: any) {
    this.page = event;
    this.cgetAllTaskByStoryRef();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.cgetAllTaskByStoryRef();
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

  handleExport() {
    const headings = [[
      'Reference',
      'Title',

    ]];
    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, this.csvTask, { origin: 'A2', skipHeader: true });
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
