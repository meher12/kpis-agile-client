import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';

@Component({
  selector: 'app-create-projet',
  templateUrl: './create-projet.component.html',
  styleUrls: ['./create-projet.component.css']
})
export class CreateProjetComponent implements OnInit {

  submitted = false;
  projet: Projet = new Projet();

  constructor(private projectService: ProjectService, private router: Router, private formBuilder: FormBuilder, private datePipe: DatePipe) { }


  form: FormGroup = new FormGroup({
    titre: new FormControl(''),
    description: new FormControl(''),
    date_debut: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    date_fin: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
  });


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required]
    });
  }

  saveProjet() {
    this.projectService.createProject(this.projet)
      .subscribe(data => {
        console.log(data);
        this.gotToProjectList();
      },
        error => console.log(error)
      )
  }

  gotToProjectList() {
    this.router.navigate(['/projets']);
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
