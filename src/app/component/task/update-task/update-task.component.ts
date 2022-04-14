import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ETask, ETypeTask } from 'src/app/models/etask.enum';
import { Story } from 'src/app/models/story.model';
import { Task } from 'src/app/models/task.model';
import { StoryService } from 'src/app/services/story/story.service';
import { TaskService } from 'src/app/services/task/task.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import Swal from 'sweetalert2';
import { DateValidator } from '../../date.validator';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.css']
})
export class UpdateTaskComponent implements OnInit {

  isLoggedIn = false;
  showPOBoard = false;
  roles: string[] = [];

  msgError = "";
  submitted = false;
  task: Task = new Task();
  story: Story;

  id: number;
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

  selectedValue;
  etypetask = [
    {name: 'Default_task', value: ETypeTask[0]},
    {name: 'More_task', value:  ETypeTask[1]},
  ];

  selectedValue2;
  estatus = [
    {name: 'Scheduled', value: ETask[0]},
    {name: 'In_progress', value: ETask[1]},
    {name: 'Cancelled', value: ETask[2]},
    {name: 'Failed', value: ETask[3]},
    {name: 'Completed', value: ETask[4]},
    {name: 'Succeeded', value: ETask[5]},
  ];

  constructor( private router: Router, private formBuilder: FormBuilder,
    private tokenStorageService: TokenStorageService, private taskService: TaskService, private route: ActivatedRoute) { }

  form: FormGroup = new FormGroup({
    tReference: new FormControl(),
    tname: new FormControl(),
    tdescription: new FormControl(),
    testimation: new FormControl(),
    tdateDebut: new FormControl(),
    tdateFin: new FormControl(),
    status: new FormControl(),
    typeTask: new FormControl(),
    estimation: new  FormControl(),
    bugs: new  FormControl(),
  });

  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');

      // get id from task list
      this.id = this.route.snapshot.params['id'];
      this.taskService.getTaskById(this.id)
        .subscribe(data => {

          this.task = data;
          //console.log("***---" + this.task.status);
          this.form = this.formBuilder.group({
            tReference: [this.task.tReference, Validators.required],
            tname: [this.task.tname, Validators.required],
            tdescription: [this.task.tdescription, Validators.required],
            tdateDebut: [this.task.tdateDebut, Validators.compose([Validators.required, DateValidator.dateVaidator])],
            tdateFin: [this.task.tdateFin, Validators.compose([Validators.required, DateValidator.dateVaidator])],
            status: [this.task.status, Validators.required],
            typeTask: [this.task.typeTask, Validators.required],
            estimation: [this.task.estimation, Validators.required],
            bugs: [this.task.bugs, Validators.required],
          });
        },
          err => {
            this.msgError = err.error.message;
            console.error(this.msgError);
          });

          this.getRefStory();
    }
  }

  // Get projectRef in create sprint from sprint list
  getRefStory() {
    this.taskService.currentrefStory
      .subscribe(storyRef => {
        this._sselectedSTRef = storyRef;

      }); //<= Always get current value!
  }

  sendRefStoryParams() {
    //Set refprodect in component 1
    this.taskService.changeSTReference(this._sselectedSTRef);
  }


  onSubmitUpdateTask() {
    this.task = this.form.value;
    this.taskService.updateTaskById(this.id, this.task)
      .subscribe(data => {
        console.log(data);
        Swal.fire('Hey!', 'Task ' + this.task.tname + ' updated', 'info')
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

  onSubmitUpdate(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    console.log(this.task);
    this.onSubmitUpdateTask();
  }

}



