import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task/task.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {

  isLoggedIn = false;
  //showPOBoard = false;
  showScrumMBoard = false;
  roles: string[] = [];

  msgError="";
  newMemberForm: FormGroup;

  tableauwkline = new Object();
  id: number;

  task: Task;

 

  constructor(private tokenStorageService: TokenStorageService, private fb:FormBuilder, private taskService: TaskService, private route: ActivatedRoute) {
   
    this.newMemberForm = this.fb.group({
      dataArray: this.fb.array([]) 
    });
  }

  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');
  

    this.id = this.route.snapshot.params['id'];
    console.log("id: ", this.id);

    this.taskService.getTaskById(this.id)
    .subscribe(data => {
      this.task = data;
   
      console.log(this.task);

    },
      err => {
       this.msgError = err.error.message;
      
      console.error(this.msgError);
      });

    }
  }
 
  dataArray() : FormArray {
    return this.newMemberForm.get("dataArray") as FormArray
  }
   
  newMember(): FormGroup {
    return this.fb.group({
      emailMember: ''
    })
  }
   
  addTeams() {
   this.dataArray().push(this.newMember());
  }
   
  removeMember(i:number) {
    this.dataArray().removeAt(i);
  }


   
 createMemberProject(){
    console.log("id: ", this.id);

  this.tableauwkline  =  Object.values(this.dataArray().value) //Object.entries(this.dataArray().value)

  this.taskService.addUpdateTeamMember(this.id,  this.tableauwkline)
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
   this.createMemberProject();
  }

}
