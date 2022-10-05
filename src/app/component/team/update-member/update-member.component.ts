import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { TeamService } from 'src/app/services/team/team.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-member',
  templateUrl: './update-member.component.html',
  styleUrls: ['./update-member.component.scss']
})
export class UpdateMemberComponent implements OnInit {

  isLoggedIn = false;
  showScrumMBoard = false;
  roles: string[] = [];

  id: number;
  msgError = "";
  submitted = false;
  user: User = new User();

  // show hide password
  public showPasswordOnPress: boolean;
  
  constructor(private teamService: TeamService, private router: Router, private formBuilder: FormBuilder,
    private route: ActivatedRoute, private tokenStorageService: TokenStorageService) { }

  form: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  });

  ngOnInit(): void {


    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      // get id from project list
      this.id = this.route.snapshot.params['id'];
      this.teamService.getUserById(this.id)
        .subscribe(data => {

          this.user = data;

          this.form = this.formBuilder.group({
            username: [this.user.username, Validators.required],
            password: [this.user.password, Validators.required],

          });

        },
          err => {
            this.msgError = err.error.message;
            console.error(this.msgError);
          })
    }
  }
  


  onSubmitUpdateUser() {
    this.user = this.form.value;
    this.teamService.updateUser(this.id, this.user)
      .subscribe(data => {
        console.log(data);
        Swal.fire('Hey!', 'User ' + this.user.username + ' updated', 'info')
        this.gotToTeamList();
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        }
      )
  }

  gotToTeamList() {
    this.router.navigate(['/teamList']);
  }

  get fctl(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmitUpdate(): void {

    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    console.log(this.user);
    this.onSubmitUpdateUser();
  }

}
