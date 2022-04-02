import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';


import Swal from 'sweetalert2';
import { DateValidator } from '../../date.validator';

@Component({
  selector: 'app-update-projet',
  templateUrl: './update-projet.component.html',
  styleUrls: ['./update-projet.component.css']
})
export class UpdateProjetComponent implements OnInit {

  isLoggedIn = false;
  showPOBoard = false;
  roles: string[] = [];

  id: number;
  msgError = "";
  submitted = false;
  projet: Projet = new Projet();


  constructor(private projectService: ProjectService, private router: Router, private formBuilder: FormBuilder,
    private route: ActivatedRoute,  private tokenStorageService: TokenStorageService) { }


  form: FormGroup = new FormGroup({
    titre: new FormControl(),
    pReference: new FormControl(),
    descriptionProject: new FormControl(),
    dateDebut: new FormControl(),
    dateFin: new FormControl(),
    totalstorypointsinitiallycounts: new FormControl(),
  });

  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      
      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');

    // get id from project list
    this.id = this.route.snapshot.params['id'];
    this.projectService.getProjectById(this.id)
      .subscribe(data => {

        this.projet = data;

        this.form = this.formBuilder.group({
          titre: [this.projet.titre, Validators.required],
          pReference: [this.projet.pReference, Validators.required],
          totalstorypointsinitiallycounts: [this.projet.totalstorypointsinitiallycounts, Validators.required],
          descriptionProject: [this.projet.descriptionProject, Validators.required],
          dateDebut: [this.projet.dateDebut, Validators.compose([Validators.required, DateValidator.dateVaidator])],
          dateFin: [this.projet.dateFin, Validators.compose([Validators.required, DateValidator.dateVaidator])],
        });



      },
        err => {
          this.msgError = err.error.message;
          console.error(this.msgError);
        }
      )

    }
  }

  onSubmitUpdateProject() {

    this.projet = this.form.value;
    this.projectService.updateProject(this.id, this.projet)
      .subscribe(data => {
        console.log(data);
        Swal.fire('Hey!', 'Project ' + this.projet.titre + ' updated', 'info')
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
