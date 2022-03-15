import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Story } from 'src/app/models/story.model';
import { StoryService } from 'src/app/services/story/story.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-story',
  templateUrl: './update-story.component.html',
  styleUrls: ['./update-story.component.css']
})
export class UpdateStoryComponent implements OnInit {


    //Get value in component 2
    _sselectedSRef: any;
    //Getter and Setters
    get selectedSRef() { return this._sselectedSRef };
    set selectedSRef(value: string) { //debugger;
      this._sselectedSRef= value;
    }

  isLoggedIn = false;
  showPOBoard = false;
  roles: string[] = [];

  id: number;
  msgError = "";
  submitted = false;
  story: Story = new Story();


  constructor(private storyService: StoryService, private router: Router, private formBuilder: FormBuilder,
    private route: ActivatedRoute, private tokenStorageService: TokenStorageService) { }


  form: FormGroup = new FormGroup({
    stname: new FormControl(),
    stReference: new FormControl(),
    stdescription: new FormControl(),
    storyPoint: new FormControl(),
    priority: new FormControl(),
  });

  ngOnInit(): void {


    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');

      // get id from sprint list
      this.id = this.route.snapshot.params['id']
      this.storyService.getStoryById(this.id)
      .subscribe(data => {
          this.story = data;

          this.form = this.formBuilder.group({
            stname: [this.story.stname, Validators.required],
            stReference: [this.story.stReference, Validators.required],
            stdescription: [this.story.stdescription, Validators.required],
            storyPoint: [this.story.storyPoint, Validators.required],
            priority: [this.story.priority, Validators.required],
          });
        },
          err => {
            this.msgError = err.error.message;
            console.error("err: "+this.msgError);
          }
        )

    }
  }



  // Get projectRef in create sprint from sprint list
  getRefSprint() {
    this.storyService.currentrefSprint
      .subscribe(sprintRef => {
        this._sselectedSRef = sprintRef;

        // set local storage
        //localStorage.setItem('sprintrefTostorylist', this._sselectedSRef);

        //localStorage of ref project
        // localStorage.setItem('refproject', this.selectedPRef);
      }); //<= Always get current value!
  }

  sendRefSprintParams() {
    //Set refprodect in component 1
    this.storyService.changeSReference(this._sselectedSRef);
  }


  onSubmitUpdateStory() {
    this.story = this.form.value;
    this.storyService.updateStoryById(this.id, this.story)
      .subscribe(data => {
        console.log(data);
        Swal.fire('Hey!', 'Story ' + this.story.stname + ' updated', 'info')
        this.gotToStoryListBysref();
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        }
      )
  }

  gotToStoryListBysref() {
    this.router.navigate(['/storylistByspr']);
  }

  get fctl(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmitUpdate(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    console.log(this.story);
    this.onSubmitUpdateStory();
  }
}
