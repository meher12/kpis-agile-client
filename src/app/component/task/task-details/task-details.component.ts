import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { Team } from 'src/app/models/team.model';
import { TaskService } from 'src/app/services/task/task.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {

  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;
  showDevBoard: boolean = false;
  roles: string[] = [];
  msgError = "";

  id: number;
  task: Task;

  teamList: Team[];

  displayStyle = "none";

  constructor(private taskService: TaskService,  private route: ActivatedRoute,
    private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {

    if (!localStorage.getItem('task_data')) { 
      localStorage.setItem('task_data', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('task_data') 
    }

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');
      this.showDevBoard = this.roles.includes('ROLE_DEVELOPER');

      this.task = new Task();
      this.id = this.route.snapshot.params['id'];
      this.taskService.getTaskById(this.id)
        .subscribe(data => {
          this.task = data;
          this.teamList = this.task.users;
          
         console.log(this.task);

        },
          err => {
           this.msgError = err.error.message;
           Swal.fire('Hey!', this.msgError, 'warning');
          console.error(this.msgError);
          });
    }
  }

  openPopup(id: number) {
    this.router.navigate([{ outlets: { memberTaskPopup: ['addMemberTask', id] } }]);
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
    this.router.navigate([{ outlets: { addspPopup: null } }]);
    location.reload();
  }

}
