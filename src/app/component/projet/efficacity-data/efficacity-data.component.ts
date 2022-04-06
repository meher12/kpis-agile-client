import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';

@Component({
  selector: 'app-efficacity-data',
  templateUrl: './efficacity-data.component.html',
  styleUrls: ['./efficacity-data.component.scss']
})
export class EfficacityDataComponent implements OnInit {

  id: number;
  projectdetails: Projet;
  msgError = "";
  refproject: string;

  dateArr: any[] = [];
  efficacityArr: any[] = [];

  constructor(private fb: FormBuilder, private projectService: ProjectService, private route: ActivatedRoute) {

    this.productForm = this.fb.group({
      name: '',
      quantities: this.fb.array([]),
    });
  }
  ngOnInit(): void {

    this.id = this.route.snapshot.params['id'];
    console.log("id: ", this.id);

    this.projectService.getProjectById(this.id)
      .subscribe(data => {
        this.projectdetails = data;
        this.refproject = this.projectdetails.pReference;
        console.log(this.refproject);

        this.projectService.getEfficacityByStartDateTask(this.refproject) 
        .subscribe({
          next:  (data) => {
          //const {val1, val2} = data;
         // this.dateArr = val1;
          //this.efficacityArr = val2;
          console.log("two arrays", this.dateArr);
          console.log("**** rays", data);
          }
        })

      },
        err => {
          this.msgError = err.error.message;
          console.error(this.msgError); });

         

  }

  productForm: FormGroup;



  quantities(): FormArray {
    return this.productForm.get("quantities") as FormArray
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      qty: '',
      price: '',
    })
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }

  onSubmit() {
    console.log(this.productForm.value);
  }
}

