import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-add-memeber',
  templateUrl: './add-memeber.component.html',
  styleUrls: ['./add-memeber.component.scss']
})
export class AddMemeberComponent implements OnInit {

  isLoggedIn = false;
  //showPOBoard = false;
  showScrumMBoard = false;
  roles: string[] = [];

  msgError="";
  newMemberForm: FormGroup;

  tableauwkline = new Object();
  id: number;

  projet: Projet;

 

  constructor(private tokenStorageService: TokenStorageService, private fb:FormBuilder, private projetService: ProjectService, private route: ActivatedRoute) {
   
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

    this.projetService.getProjectById(this.id)
    .subscribe(data => {
      this.projet = data;
   
      console.log(this.projet);

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

  this.projetService.addUpdateteamMember(this.id,  this.tableauwkline)
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
