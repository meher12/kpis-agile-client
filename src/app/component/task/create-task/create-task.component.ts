import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ETask, ETypeTask } from 'src/app/models/etask.enum';
import { Story } from 'src/app/models/story.model';
import { Task } from 'src/app/models/task.model';
import { StoryService } from 'src/app/services/story/story.service';
import { TaskService } from 'src/app/services/task/task.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import Swal from 'sweetalert2';
import { DateValidator } from '../../date.validator';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {

  isLoggedIn = false;
  showScrumMBoard = false;
  roles: string[] = [];

  msgError = "";
  submitted = false;
  task: Task = new Task();
  story: Story;


  selectedValue;
  etypetask = [
    {name: 'Default_task', value: ETypeTask[0]},
    {name: 'More_task', value:  ETypeTask[1]},
  ];

  selectedValue2;
  estatus = [
    {name: 'Scheduled', value: ETask[0]},
    {name: 'In_progress', value: ETask[1]},
   // {name: 'Cancelled', value: ETask[2]},
   // {name: 'Failed', value: ETask[3]},
   // {name: 'Completed', value: ETask[4]},
   // {name: 'Succeeded', value: ETask[5]},
  ];

  

  _story_id: number;
  //Getter and Setters
  get storyId() { return this._story_id };
  set storyId(value: number) { this._story_id = value; }

  //Get value in component 2
  _sselectedSTRef: any;
  //Getter and Setters
  get selectedSTRef() { return this._sselectedSTRef };
  set selectedSTRef(value: string) { //debugger;
    this._sselectedSTRef = value;
  }

  constructor(private storyService: StoryService, private router: Router, private formBuilder: FormBuilder,
    private tokenStorageService: TokenStorageService, private taskService: TaskService) { }


  form: FormGroup = new FormGroup({
    tReference: new FormControl(''),
    tname: new FormControl(''),
    tdescription: new FormControl(''),
    tdateDebut: new FormControl(''),
    tdateFin: new FormControl(''),
    status: new FormControl(''),
    typeTask: new FormControl(''),
    estimation: new FormControl(),
  });

  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.form = this.formBuilder.group({
        tname: ['', Validators.required],
        tReference: [("TUID" + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(0)).toUpperCase(), Validators.required],
        tdescription: ['', Validators.required],
        tdateDebut: ['', Validators.compose([Validators.required, DateValidator.dateVaidator])],
        tdateFin: ['', Validators.compose([Validators.required, DateValidator.dateVaidator])],
        status: ['', Validators.required],
        typeTask: ['', Validators.required],
        estimation:  ['', Validators.required],
      });

      this.getRefStory();

      this.storyService.getStoryByReference(this._sselectedSTRef)
        .subscribe(data => {
          this.story = data;
          this._story_id = this.story.id
        },
          err => {
            this.msgError = err.error.message;
            console.error(this.msgError);
          });
    }
  }


  // Get storyRef in create task from story list
  getRefStory() {
    this.taskService.currentrefStory
      .subscribe(storyRef => {
        this._sselectedSTRef = storyRef;
      }); //<= Always get current value!
  }

  sendRefStoryParams(){
    //Set refprodect in component 1
    this.taskService.changeSTReference( this._sselectedSTRef);
  }

  saveTask() {
    this.task = this.form.value;
    this.taskService.createTask(this._story_id, this.task)
      .subscribe(data => {
        console.log(data);
        Swal.fire('Hey!', 'Task ' + this.task.tname + ' is saved', 'info');
        this.gotToTaskListBystref();
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        }
      )
  }

  gotToTaskList() {
    this.router.navigate(['taskList']);
  }

  gotToTaskListBystref() {
    this.router.navigate(['taskListBystre', this._sselectedSTRef]);
  }

  get fctl(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {

    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    console.log(this.task);
    this.saveTask();
  }

   onReset(): void {
     this.submitted = false;
     this.form.reset();
     this.refresh()
     
   }
   refresh(): void {
    window.location.reload();
  }

}
