import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { Team } from 'src/app/models/team.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { read, utils, writeFile } from 'xlsx';
import { ViewAllReference } from 'src/app/models/viewAllReference.model';

import { CopyContentService } from 'src/app/services/copy-content.service';


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

  viewListFiltred: ViewAllReference[] = [];
  myJSON: any;
  top: any;
  left: any;


  constructor(private projectService: ProjectService, private sprintService: SprintService, private route: ActivatedRoute,
    private tokenStorageService: TokenStorageService, private router: Router, private copier:CopyContentService) { }

   

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
          

          let objectElement = { "username": "", "email": "", "role": "", "attachedTo": "" };
          objectElement.attachedTo = this.projectdetails.pReference
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

          // for excel list of all reference 
          this.getAllReferenceToexcel(this.projectdetails.pReference);

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
      'Role',
      'AttachedTo'
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
      showDenyButton: true, showCancelButton: true,
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


  getAllReferenceToexcel(referenceForList: string) {
    //getAllReferenceByProject
    this.projectService.getAllReferenceByProject(referenceForList)
      .subscribe(data => {

        const jsonString = JSON.stringify(Object.assign({}, data))
        this.viewListFiltred = data
      
     
      })
  }

  doCopy(){
   // https://stackblitz.com/edit/angular-text-copy-itjem7?file=src%2Fapp%2Fapp.component.ts
   this.myJSON = JSON.stringify(this.viewListFiltred);
     
   //  console.log(this.viewListFiltred.toString())

    this.copier.copyText(this.myJSON.toString());
    //alert('Your content is copied. Paste in text editor to see copied content(ctrl + V, cmd+ V)');




    Swal.fire({
      title: '<strong>Your content is copied. </strong>',
      icon: 'info',
      html:
        'You can paste in text editor to see copied content(ctrl + V, cmd+ V), ' +
        'to export project detail',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> Great!',
      confirmButtonAriaLabel: 'Thumbs up, great!',
      cancelButtonText:
        '<i class="fa fa-thumbs-down"></i>',
      cancelButtonAriaLabel: 'Thumbs down'
    }).then((result) => {
      
      if (result.isConfirmed) {
        Swal.fire({
         // title: '<strong>Your content is copied. </strong>',
         // icon: 'info',
         // html: '<a href="https://data.page/" target="popup" onclick="window.open("https://data.page/","popup", "width=600,height=600,left=500,top=300, scrollbars=no,resizable=no") return false;"> Export details  </a>'
         position: 'center',
         icon: 'success',
         title: 'You can  past your content',
         showConfirmButton: false,
         timer: 1000,
         html: "" + window.open('https://data.page/') 
        })
      } 
    });

   
  }

 

}
