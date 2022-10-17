import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { Team } from 'src/app/models/team.model';
import { TaskService } from 'src/app/services/task/task.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import { read, utils, writeFile } from 'xlsx';

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

  emailList = {};
  sendMailList = [];
  memberList: Team[];
  memberListFiltred = []

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
          //console.log(this.task);
          
          this.memberList = this.task.users;
          console.log(this.memberList);

          let objectElement = { "username": "", "email": "", "role": "" };

          for (const data of Object.values(this.memberList)) {
            objectElement.username = data.username
            objectElement.email = data.email
            for (const roleItem of Object.values(data.roles)) {
              objectElement.role = Object.values(roleItem)[1]
              this.memberListFiltred.push(Object.assign({}, objectElement))
            }
          }
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

   // **********Import Export CSV List mail File************

   handleImport($event: any) {
    const emailMember = [];
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);

          this.emailList = rows;

          for (const data of Object.values(this.emailList)) {
            this.sendMailList.push(Object.assign({}, data))

          }
          for (var i = 0; i < this.sendMailList.length; i++) {
            // console.log(this.sendMailList[i].emailMember)
            emailMember.push(this.sendMailList[i].emailMember)
          }

          // console.log("List mail: " + emailMember)
          this.taskService.addUpdateTeamMember(this.id, emailMember)
            .subscribe(data => { 
              console.log(data) 
              Swal.fire('Hey!', 'File uploaded ', 'success').then((result) => {
                /* Read more about isConfirmed, isDenied below */
                location.reload();
              })
          },
          err => {
            this.msgError = err.error.message;
            Swal.fire('Hey!', this.msgError, 'error').then((result) => {
              /* Read more about isConfirmed, isDenied below */
              location.reload();
            })
            console.error(this.msgError);
          });

        }
      }
      reader.readAsArrayBuffer(file);

    }

  }

  handleExport() {
    const headings = [[
      'Member',
      'Mail',
      'Role'
    ]];
    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, this.memberListFiltred, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, 'Report');
   
      //****************choose format file*********************** */
    
      const items = [ 
        { id: "CSV type", name: "CSV" },
        { id: "XLSX type", name: "XLSX" },
  
      ]
      
      const inputOptions = new Map
      items.forEach(item => inputOptions.set(item.id, item.name)) 
  
     Swal.fire({
        title: 'Select file format',
        input: 'radio',
        inputOptions: inputOptions,
        showDenyButton: true,  showCancelButton: true,  
        confirmButtonText: `Export`,  
        denyButtonText: `Don't export`,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to choose something!'
          }
          if (value === "CSV type") {
           // Swal.fire({ html: `You selected: ${value}` })
            writeFile(wb, 'MemberList.csv');
          }
          if (value === "XLSX type") {
           // Swal.fire({ html: `You selected: ${value}` })
            writeFile(wb, 'MemberList.xlsx');
          }
        }
      }).then((result) => {  
        /* Read more about isConfirmed, isDenied below */  
          if (result.isConfirmed) {    
            Swal.fire('File exported!', 'MemberList.csv', 'success')  
          } else if (result.isDenied) {    
            Swal.fire('File are not exported', 'MemberList.xlsx', 'info')  
         }
      });
  }


}
