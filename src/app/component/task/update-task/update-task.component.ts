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
  items = [
    {name: 'TODO', value: ETypeTask[0]},
    {name: 'MORE', value:  ETypeTask[2]},
  ];

  selectedValue2;
  items2 = [
    {name: 'SCHEDULED', value: ETask[0]},
    {name: 'IN_PROGRESS', value: ETask[1]},
    {name: 'COMPLETED', value: ETask[2]},
  ];

  constructor(private storyService: StoryService, private router: Router, private formBuilder: FormBuilder,
    private tokenStorageService: TokenStorageService, private taskService: TaskService, private route: ActivatedRoute) { }

  form: FormGroup = new FormGroup({
    tReference: new FormControl(),
    tname: new FormControl(),
    tdescription: new FormControl(),
    testimation: new FormControl(),
    tdateDebut: new FormControl(),
    tdateFin: new FormControl(),
    statut: new FormControl(),
    typeTask: new FormControl(),
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
          console.log("***---" + this.task.statut);
          this.form = this.formBuilder.group({
            tReference: [this.task.tReference, Validators.required],
            tname: [this.task.tname, Validators.required],
            tdescription: [this.task.tdescription, Validators.required],
            tdateDebut: [this.task.tdateDebut, Validators.compose([Validators.required, DateValidator.dateVaidator])],
            tdateFin: [this.task.tdateFin, Validators.compose([Validators.required, DateValidator.dateVaidator])],
            testimation: [this.task.testimation, Validators.required],
            statut: [this.task.statut, Validators.required],
            typeTask: [this.task.typeTask, Validators.required],
          });
        },
          err => {
            this.msgError = err.error.message;
            console.error(this.msgError);
          });
    }
  }

  // Get projectRef in create sprint from sprint list
  getRefStory() {
    this.taskService.currentrefStory
      .subscribe(storyRef => {
        this._sselectedSTRef = storyRef;
        // set local storage
        localStorage.setItem('refstoryfortasklist', this._sselectedSTRef);

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

  gotToTaskListBystref() {
    this.router.navigate(['taskListBystre']);
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



