import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';


import Swal from 'sweetalert2';
import { DateValidator } from '../date.validator';
@Component({
  selector: 'app-update-projet',
  templateUrl: './update-projet.component.html',
  styleUrls: ['./update-projet.component.css']
})
export class UpdateProjetComponent implements OnInit {

  id: number;
  msgError = "";
  submitted = false;
  projet: Projet = new Projet();
  form: FormGroup;

  constructor(private projectService: ProjectService, private router: Router, private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    // form


    // get id from project list
    this.id = this.route.snapshot.params['id'];
    this.projectService.getProjectById(this.id)
      .subscribe(data => {

        this.projet = data;

        this.form = this.formBuilder.group({
          titre: [this.projet.titre, Validators.required],
          description: [this.projet.description, Validators.required],
          date_debut: [this.projet.date_debut, Validators.compose([Validators.required, DateValidator.dateVaidator])],
          date_fin: [this.projet.date_fin, Validators.compose([Validators.required, DateValidator.dateVaidator])],
        });



      },
        err => {
          this.msgError = err.error.message;
          console.error(this.msgError);
        }
      )

  }

  onSubmitUpdateProject() {

    this.projet = this.form.value;
    this.projectService.updateProject(this.id, this.projet)
      .subscribe(data => {
        console.log(data);
        Swal.fire('Hey!', 'Project is updated', 'info')
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

  onSubmitUpdate(): void {

    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    console.log(this.projet);
    this.onSubmitUpdateProject();
  }
}
