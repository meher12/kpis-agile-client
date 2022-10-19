import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Sprint } from 'src/app/models/sprint.model';
import { Story } from 'src/app/models/story.model';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { StoryService } from 'src/app/services/story/story.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-story',
  templateUrl: './create-story.component.html',
  styleUrls: ['./create-story.component.css']
})
export class CreateStoryComponent implements OnInit {

  isLoggedIn = false;
  showScrumMBoard = false;
  roles: string[] = [];

  msgError = "";
  submitted = false;
  story: Story = new Story();
  sprint: Sprint;



  _sprint_id: number;
  //Getter and Setters
  get sprintId() { return this._sprint_id };
  set sprintId(value: number) { this._sprint_id = value; }

  //Get value in component 2
  _sselectedSRef: any;
  //Getter and Setters
  get selectedSRef() { return this._sselectedSRef };
  set selectedSRef(value: string) { //debugger;
    this._sselectedSRef= value;
  }

  constructor(private storyService: StoryService, private router: Router, private formBuilder: FormBuilder,
    private tokenStorageService: TokenStorageService, private sprintService: SprintService) { }


  form: FormGroup = new FormGroup({
    stname: new FormControl(''),
    stReference: new FormControl(''),
    stdescription: new FormControl(''),
   // storyPoint: new FormControl(''),
    priority: new FormControl(''),
  });

  

  ngOnInit(): void {
   
    this.isLoggedIn = !!this.tokenStorageService.getToken();
   /*  localStorage.removeItem('refsprint');
    localStorage.setItem('refsprint', this.form.controls.stReference.value ); */

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.form = this.formBuilder.group({
        stname: ['', Validators.required],
        stReference: [("STUID" + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(0)).toUpperCase(), Validators.required],
        stdescription: ['', Validators.required],
        //storyPoint: ['', Validators.required],
        priority: ['', Validators.required],
      });


     
      this.getRefSprint();
      this.sprintService.getSprintByReference(this._sselectedSRef)
        .subscribe(data => {
          this.sprint = data;
          this._sprint_id = this.sprint.id
          console.log("------------"+ this._sprint_id)
        },
          err => {
            this.msgError = err.error.message;
            console.error(this.msgError);
          });

         

    }
  }

   // Get projectRef in create sprint from sprint list
   getRefSprint() {
    this.storyService.currentrefSprint
      .subscribe(sprintRef => {
        this._sselectedSRef = sprintRef;
      }); //<= Always get current value!
  }

  sendRefSprintParams(){
    //Set refprodect in component 1
    this.storyService.changeSReference(this._sselectedSRef);
      
  }

  
 

  saveStory() {
    this.story = this.form.value;
    this.storyService.createStory(this._sprint_id, this.story)
      .subscribe(data => {
        console.log(data);
        Swal.fire('Hey!', 'Story ' + this.story.stname + ' is saved', 'info');
        //console.log("*********"+ this._sprint_id)
        this.gotToStoryListBysref();
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        }
      )
  }

  gotToStoryList() {
    this.router.navigate(['storyList']);
  }
  gotToStoryListBysref() {
    this.router.navigate(['storylistByspr', this._sselectedSRef]);
  }

  get fctl(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {

    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    console.log(this.story);
    this.saveStory();
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
