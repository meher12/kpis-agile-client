import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Sprint } from 'src/app/models/sprint.model';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';


import Swal from 'sweetalert2';
import { DateValidator } from '../../date.validator';

@Component({
  selector: 'app-update-sprint',
  templateUrl: './update-sprint.component.html',
  styleUrls: ['./update-sprint.component.css']
})
export class UpdateSprintComponent implements OnInit {


   //Get value in component 2
   _selectedPRef: any;
   //Getter and Setters
   get selectedPRef() { return this._selectedPRef };
   set selectedPRef(value: string) { //debugger;
     this._selectedPRef = value;
   }

  isLoggedIn = false;
  showPOBoard = false;
  roles: string[] = [];

  id: number;
  msgError = "";
  submitted = false;
  sprint: Sprint = new Sprint();


  constructor(private sprintService: SprintService, private router: Router, private formBuilder: FormBuilder,
    private route: ActivatedRoute,  private tokenStorageService: TokenStorageService) { }


  form: FormGroup = new FormGroup({
    stitre: new FormControl(),
    sReference: new FormControl(),
    sdescription: new FormControl(),
    sdateDebut: new FormControl(),
    sdateFin: new FormControl(),
  });

  ngOnInit(): void {

   
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      
      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');

    // get id from sprint list
    this.id = this.route.snapshot.params['id'];
    this.sprintService.getSprintById(this.id)
      .subscribe(data => {

        this.sprint = data;

        this.form = this.formBuilder.group({
          stitre: [this.sprint.stitre, Validators.required],
          sReference: [this.sprint.sReference, Validators.required],
          sdescription: [this.sprint.sdescription, Validators.required],
          sdateDebut: [this.sprint.sdateDebut, Validators.compose([Validators.required, DateValidator.dateVaidator])],
          sdateFin: [this.sprint.sdateFin, Validators.compose([Validators.required, DateValidator.dateVaidator])],
        });
      },
        err => {
          this.msgError = err.error.message;
          console.error(this.msgError);
        } )
        this.getRefProject();
    }
  }



 // Get projectRef in create sprint from sprint list
 getRefProject() {
  this.sprintService.currentrefProject
    .subscribe(projectRef => {
      this.selectedPRef = projectRef;

    }); //<= Always get current value!
}

sendRefProjectParams(){
  //Set refprodect in component 1
  this.sprintService.changePReference(this.selectedPRef);
}


  onSubmitUpdateSprint() {
    this.sprint = this.form.value;
    this.sprintService.updateSprintById(this.id, this.sprint)
      .subscribe(data => {
        console.log(data);
        Swal.fire('Hey!', 'Sprint ' + this.sprint.stitre + ' updated', 'info')
        this.gotToSprintListBypref();
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        }
      )
  }

  gotToSprintList() {
    this.router.navigate(['/sprintList']);
  }

  gotToSprintListBypref() {
    this.router.navigate(['sprintListBypre', this.selectedPRef]);
  }

  get fctl(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmitUpdate(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    console.log(this.sprint);
    this.onSubmitUpdateSprint();
  }
}
