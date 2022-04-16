import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Projet, TaskBugs } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';

@Component({
  selector: 'app-task-bugs-data',
  templateUrl: './task-bugs-data.component.html',
  styleUrls: ['./task-bugs-data.component.scss']
})
export class TaskBugsDataComponent implements OnChanges, OnInit {

  projecttaskbug: Projet;
  listsStartDate: any[];
  listsStartDate2: any[];
  msgError = "";


  dateArray: any[] = [];
  efficacityArray: any[] = [];
  endDateArray: any[] = [];

  taskbugs: TaskBugs;

  @Output() taskbugsChange = new EventEmitter<TaskBugs>();
  @Input() projectSent;
  //changelog: string[] = [];

  productForm: FormGroup;

  constructor(private fb: FormBuilder, private projectService: ProjectService, private route: ActivatedRoute) {}

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

  }
  ngOnInit(): void { }

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
    this.projectService.getTaskBugsByStartDateTask(this.projectSent, this.dateArray)
      .subscribe(
        {
          next: (data) => {
            //const { KeyArr, FloatArr } = data;
            this.taskbugs = data;
           // console.log("efficacity: ", this.efficacity);
            this.taskbugsChange.emit(this.taskbugs);
          },

          error: err => console.error(err),
          //complete: () => console.log('DONE!')
        })

  }
}

