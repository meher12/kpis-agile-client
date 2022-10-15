import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { Sprint } from 'src/app/models/sprint.model';
import { Team } from 'src/app/models/team.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { read, utils, writeFile } from 'xlsx';

@Component({
  selector: 'app-projet-details',
  templateUrl: './projet-details.component.html',
  styleUrls: ['./projet-details.component.css']
})
export class ProjetDetailsComponent implements OnInit {


  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;
  roles: string[] = [];
  msgError = "";

  id: number;
  preference: string;

  projectdetails: Projet;
  teamList: Team[];

  displayStyle = "none";

  sprintSorted: any[] = [];

  emailList = {};
  sendMailList = [];
  memberList: Team[];
  memberListFiltred = []


  constructor(private projectService: ProjectService, private sprintService: SprintService, private route: ActivatedRoute,
    private tokenStorageService: TokenStorageService, private router: Router) { }



  ngOnInit(): void {

    /*  if (!localStorage.getItem('project_data')) {
       localStorage.setItem('project_data', 'no reload')
       location.reload()
     } else {
       localStorage.removeItem('project_data')
     } */

    this.updateTablesprint();
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.projectdetails = new Projet();
      this.id = this.route.snapshot.params['id'];
      this.projectService.getProjectById(this.id)
        .subscribe(data => {
          this.projectdetails = data;
          this.memberList = this.projectdetails.users;
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




          //*************** */
          var sprintNotStored = this.projectdetails.sprints;
          // sort sprints array
          this.sprintSorted = sprintNotStored.sort((a, b) => {
            return moment(a.sdateDebut).diff(b.sdateDebut);
          });
          //**************** */
          this.teamList = this.projectdetails.users;
          // console.log(this.projectdetails);


        },
          err => {
            this.msgError = err.error.message;
            Swal.fire('Hey!', this.msgError, 'warning');
            console.error("*******" + this.msgError);
          });

    }
  }

  // update work Commitment and work Completed in sprint
  updateTablesprint() {
    this.sprintService.updateStoryPointInSprint()
      .subscribe(data => console.log(data));
  }



  openPopup(id: number) {
    this.router.navigate([{ outlets: { addMemberPopup: ['addmemeber', id] } }]);
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
          this.projectService.addUpdateteamMember(this.id, emailMember)
            .subscribe(data => { console.log(data) })

        }
      }
      reader.readAsArrayBuffer(file);
      location.reload();

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
    writeFile(wb, 'MemberList.csv');
  }

  handleExportXlsx() {
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
    writeFile(wb, 'MemberList.xlsx');
  }

  // **********************

}
