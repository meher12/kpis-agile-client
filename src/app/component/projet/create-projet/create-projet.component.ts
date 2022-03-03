import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';


import Swal from 'sweetalert2';
import { DateValidator } from '../date.validator';

@Component({
  selector: 'app-create-projet',
  templateUrl: './create-projet.component.html',
  styleUrls: ['./create-projet.component.css']
})
export class CreateProjetComponent implements OnInit {

  msgError = "";
  submitted = false;
  projet: Projet = new Projet();

  constructor(private projectService: ProjectService, private router: Router, private formBuilder: FormBuilder) { }


  form: FormGroup = new FormGroup({
    titre: new FormControl(''),
    description: new FormControl(''),
    date_debut: new FormControl(''),
    date_fin: new FormControl(''),
  });


  ngOnInit(): void {

      this.form = this.formBuilder.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      date_debut: ['', Validators.compose([Validators.required, DateValidator.dateVaidator])],
      date_fin: ['', Validators.compose([Validators.required, DateValidator.dateVaidator])],
    });
    
    
  }

  saveProjet() {
    this.projet = this.form.value;
    this.projectService.createProject(this.projet)
      .subscribe(data => {
        console.log(data);
        Swal.fire('Hey!', 'Project is saved', 'info')
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
  }
}
