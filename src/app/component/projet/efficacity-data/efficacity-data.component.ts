import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Efficacity, Projet } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';

@Component({
  selector: 'app-efficacity-data',
  templateUrl: './efficacity-data.component.html',
  styleUrls: ['./efficacity-data.component.scss']
})
export class EfficacityDataComponent implements OnChanges, OnInit {

  projecteffi: Projet;
  listsStartDate: any[];
  listsStartDate2: any[];
  msgError = "";


  dateArray: any[] = [];
  efficacityArray: any[] = [];
  endDateArray: any[] = [];

  efficacity: Efficacity;

  @Output() efficacityChange = new EventEmitter<Efficacity>();
  @Input() projectSent;
  //changelog: string[] = [];

  productForm: FormGroup;

  constructor(private fb: FormBuilder, private projectService: ProjectService, private route: ActivatedRoute) {

  }

  ngOnChanges(changes: SimpleChanges) {

    this.productForm = this.fb.group({
      name: this.projectSent,
      quantities: this.fb.array([]),
    });

    if (this.projectSent) {
      this.projectService.getListTaskStartDateBypRef(this.projectSent)
        .subscribe({
          next: data => {
            this.listsStartDate = data;
            this.listsStartDate = [...new Set(this.listsStartDate)];
          }
        })
    }


    /*  console.log('OnChanges'+ this.projectSent);
     console.log(JSON.stringify(changes)); */

    // tslint:disable-next-line:forin
    /*  for (const propName in changes) {
       const change = changes[propName];
       const to  = JSON.stringify(change.currentValue);
       const from = JSON.stringify(change.previousValue);
       const changeLog = `${propName}: changed from ${from} to ${to} `;
       this.changelog.push(changeLog); 
    }*/
  }
  ngOnInit(): void {


  }

  quantities(): FormArray {
    return this.productForm.get("quantities") as FormArray
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      startDate: '',
      endDate: '',
    })
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }

  onSubmit() {
    this.dateArray = Object.values(this.quantities().value);
    this.projectService.getEfficacityByStartDateTask(this.projectSent, this.dateArray)
      .subscribe(
        {
          next: (data) => {
            //const { KeyArr, FloatArr } = data;
            this.efficacity = data;
           // console.log("efficacity: ", this.efficacity);
            this.efficacityChange.emit(this.efficacity);
            /*  this.endDateArray = KeyArr 
             this.efficacityArray = FloatArr  
             console.log("two arrays", this.endDateArray);
            console.log("**** rays", this.efficacityArray); */
          },

          error: err => console.error(err),
          //complete: () => console.log('DONE!')
        })

  }
}

