import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Sprint } from 'src/app/models/sprint.model';

import { SprintService } from 'src/app/services/sprints/sprint.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-add-sp-completed',
  templateUrl: './add-sp-completed.component.html',
  styleUrls: ['./add-sp-completed.component.scss']
})
export class AddSpCompletedComponent implements OnInit {

  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;
  roles: string[] = [];

  msgError="";
  workCompletedForm: FormGroup;

  tableauwkline = new Object();
  id: number;

  sprint: Sprint;

 

  constructor(private tokenStorageService: TokenStorageService, private fb:FormBuilder, private sprintService: SprintService, private route: ActivatedRoute) {
   
    this.workCompletedForm = this.fb.group({
      dataArray: this.fb.array([]) 
    });
  }

  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');
  

    this.id = this.route.snapshot.params['id'];
    console.log("id: ", this.id);

    this.sprintService.getSprintById(this.id)
    .subscribe(data => {
      this.sprint = data;
   
      console.log(this.sprint);

    },
      err => {
       this.msgError = err.error.message;
      
      console.error(this.msgError);
      });

    }
  }
 
  dataArray() : FormArray {
    return this.workCompletedForm.get("dataArray") as FormArray
  }
   
  newStoryPoint(): FormGroup {
    return this.fb.group({
     storypC: ''
    })
  }
   
  addWorkCompleted() {
   this.dataArray().push(this.newStoryPoint());
  }
   
  removeStoryPoint(i:number) {
    this.dataArray().removeAt(i);
  }


   
  onupdateStoryPointCompleted(){
    console.log("id: ", this.id);

  this.tableauwkline  =  Object.values(this.dataArray().value) //Object.entries(this.dataArray().value)

  this.sprintService.updateSprintWorkCompleted(this.id,  this.tableauwkline)
     .subscribe(data => {
      console.log(data);
      //console.log("-------", Object.values(this.tableauwkline));
   
    },
      err => {
        this.msgError = err.error.message;
        console.error(this.msgError);
      } ) 
  }

  onSubmit() {
   this.onupdateStoryPointCompleted();
  }


}
