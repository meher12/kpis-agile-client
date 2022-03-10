import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Projet } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';


import Swal from 'sweetalert2';
import { DateValidator } from '../../date.validator';

@Component({
  selector: 'app-create-projet',
  templateUrl: './create-projet.component.html',
  styleUrls: ['./create-projet.component.css']
})
export class CreateProjetComponent implements OnInit {

  isLoggedIn = false;
  showPOBoard = false;
  roles: string[] = [];

  msgError = "";
  submitted = false;
  projet: Projet = new Projet();

  constructor(private projectService: ProjectService, private router: Router, private formBuilder: FormBuilder,
    private tokenStorageService: TokenStorageService) { }


  form: FormGroup = new FormGroup({
    titre: new FormControl(''),
    pReference: new FormControl(''),
    descriptionProject: new FormControl(''),
    dateDebut: new FormControl(''),
    dateFin: new FormControl(''),
  });


  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');

      this.form = this.formBuilder.group({
        titre: ['', Validators.required],
        pReference: [("PUID" + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(0)).toUpperCase(), Validators.required],
        descriptionProject: ['', Validators.required],
        dateDebut: ['', Validators.compose([Validators.required, DateValidator.dateVaidator])],
        dateFin: ['', Validators.compose([Validators.required, DateValidator.dateVaidator])],
      });

    }

  }

  saveProjet() {
    this.projet = this.form.value;
    this.projectService.createProject(this.projet)
      .subscribe(data => {
        console.log(data);
        Swal.fire('Hey!', 'Project ' + this.projet.titre + ' is saved', 'info')
        this.gotToProjectList();
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        }
      )
  }

  gotToProjectList() {
    this.router.navigate(['/projectList']);
  }

  get fctl(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {

    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    console.log(this.projet);
    this.saveProjet();
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
    this.refresh();
  }

  refresh(): void {
    window.location.reload();
  }
  /*  onGenerateId(event: any){
 
      event.target.value = ("PUID" + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(0)).toUpperCase();
 
     this.form.setValue({
       uniqueID: ("PUID" + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(0)).toUpperCase()
     });  
   } */

}
