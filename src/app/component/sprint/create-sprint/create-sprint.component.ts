import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { Sprint } from 'src/app/models/sprint.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import Swal from 'sweetalert2';
import { DateValidator } from '../../date.validator';

@Component({
  selector: 'app-create-sprint',
  templateUrl: './create-sprint.component.html',
  styleUrls: ['./create-sprint.component.css']
})
export class CreateSprintComponent implements OnInit {

  isLoggedIn = false;
  showPOBoard = false;
  roles: string[] = [];

  msgError = "";
  submitted = false;
  sprint: Sprint = new Sprint();
  project: Projet;



  _project_id: number;
  //Getter and Setters
  get projectId() { return this._project_id };
  set projectId(value: number) { this._project_id = value; }

  //Get value in component 2
  _sselectedPRef: any;
  //Getter and Setters
  get selectedPRef() { return this._sselectedPRef };
  set selectedPRef(value: string) { //debugger;
    this._sselectedPRef= value;
  }

  //how to use from another component
  /* let mc = new MessageComponent();
  mc.selectedPRef = "You were always on my mind";
  let message = mc.selectedPRef; */

  constructor(private sprintService: SprintService, private router: Router, private formBuilder: FormBuilder,
    private tokenStorageService: TokenStorageService, private projetService: ProjectService) { }


  form: FormGroup = new FormGroup({
    stitre: new FormControl(''),
    sReference: new FormControl(''),
    sdescription: new FormControl(''),
    sdateDebut: new FormControl(''),
    sdateFin: new FormControl(''),
  });


  ngOnInit(): void {


    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');

      this.form = this.formBuilder.group({
        stitre: ['', Validators.required],
        sReference: [("SUID" + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(0)).toUpperCase(), Validators.required],
        sdescription: ['', Validators.required],
        sdateDebut: ['', Validators.compose([Validators.required, DateValidator.dateVaidator])],
        sdateFin: ['', Validators.compose([Validators.required, DateValidator.dateVaidator])],
      });

     
      // storage of ref sprint
      //localStorage of ref project
     
      //localStorage.setItem('refsprint', this.form.controls.sReference.value );
      //window.sessionStorage.removeItem('refproject');
      //window.sessionStorage.removeItem('refsprint');
      
      this.getRefProject();

      this.projetService.getProjectByReference(this._sselectedPRef)
        .subscribe(data => {
          this.project = data;
          this._project_id = this.project.id
        },
          err => {
            this.msgError = err.error.message;
            console.error(this.msgError);
          });
    }

  }

  // Get projectRef in create sprint from sprint list
  getRefProject() {
    this.sprintService.currentrefProject
      .subscribe(projectRef => {
        this._sselectedPRef = projectRef;
    // set local storage
      localStorage.setItem('refprojectforsprintlist', this._sselectedPRef);
      }); //<= Always get current value!
  }

  sendRefProjectParams(){
    //Set refprodect in component 1
    this.sprintService.changePReference( this._sselectedPRef);
      
  }
 

  saveSprint() {
    this.sprint = this.form.value;
    this.sprintService.createSprint(this._project_id, this.sprint)
      .subscribe(data => {
        console.log(data);
        Swal.fire('Hey!', 'Sprint ' + this.sprint.stitre + ' is saved', 'info');
        console.log("*********"+ this._project_id)
        this.gotToSprintListBypref();
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        }
      )
  }

  gotToSprintListBypref() {
    this.router.navigate(['/sprintListBypre']);
  }

  get fctl(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {

    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    console.log(this.sprint);
    this.saveSprint();
  }

   onReset(): void {
     this.submitted = false;
     this.form.reset();
     //this.refresh()
     //localStorage.getItem('refsprint');
   }
   refresh(): void {
    window.location.reload();
  }

}
