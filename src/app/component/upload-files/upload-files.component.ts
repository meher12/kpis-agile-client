import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';
import * as swal from 'sweetalert2';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ProjectService } from 'src/app/services/projects/project.service';
import { Projet } from 'src/app/models/projet.model';
@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss']
})
export class UploadFilesComponent implements OnChanges, OnInit {


  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  fileName;
  savefileIndb: boolean;
  reportName;
  messageResponse;

  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;
  showDevBoard = false;
  roles: string[] = [];


  projects: Projet[];
  project: Projet;
  selectedListOption;
  selected;

  projectReference;
  
  ngOnChanges(changes: SimpleChanges): void {
    this.fileInfos = this.uploadService.getFiles();
  }
  ngOnInit(): void {
    // this.fileInfos = this.uploadService.getFiles();

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');
      this.showDevBoard = this.roles.includes('ROLE_DEVELOPER');

      this.getTitleProjects();


    }

  }



  constructor(private uploadService: FileUploadService, private tokenStorageService: TokenStorageService, private projectService: ProjectService) { }
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }


// ************************

// Get All projects
getTitleProjects() {
  this.projectService.getProjectList()
    .subscribe(data => {
      this.projects = data;
    })
}

sendProjectRef(event: any) {

  this.selectedListOption = true;
 


  //get project name
  this.projectService.getProjectByReference(event.target.value)
    .subscribe(data => {
      this.project = data;
      console.log("***********-----------"+this.project.pReference);
      this.projectReference = this.project.pReference;
    })


}

// ************************








  upload(): void {
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.fileName = file.name;

        this.currentFile = file;
        this.uploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              Swal.fire('Hey!', this.message, 'success')
                .then((value: any) => {
                  this.savefileIndb = value;
                })
              this.fileInfos = this.uploadService.getFiles();
              this.savefileIndb = false;
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;
            if (err.error && err.error.message) {
              this.message = err.error.message;
              Swal.fire('Hey!', this.message, 'warning')
              this.fileInfos = this.uploadService.getFiles();
            } else {
              this.message = 'Could not upload the file!';
              Swal.fire('Hey!', 'Could not upload the file!', 'warning')
              this.fileInfos = this.uploadService.getFiles();

            }
            this.currentFile = undefined;
          }
        });
      }
      this.selectedFiles = undefined;
    }
  }

  /* deleteFile(url: string) {
    var path = url;
    var directories = path.split("/");
    var lastDirecotry = directories[(directories.length - 1)];
    this.uploadService.deleteFileById(lastDirecotry)
    .subscribe(data => {console.log(data)})
    this.fileInfos = this.uploadService.getFiles();
  } */

  getreportName(event: any) {
    this.reportName = event;
    //console.log( this.reportName)
  }

  // delete report
  deleteFilebyName(file: any) {
    this.uploadService.deleteFileByName(file.name, this.reportName)
      .subscribe(data => { console.log(data) })
    this.fileInfos = this.uploadService.getFiles();
  }

  updateFilename(file: File) {
    Swal.fire({
      title: "Update file nmae",
      text: "rename report file name:",
      input: 'text',
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        //console.log("Result: " + result.value);
        this.uploadService.updateFileName(file.name, result.value)
          .subscribe(data => {
            //console.log(data)
            this.messageResponse = data
            /* this.messageResponse.then((res)=> {
              Swal.fire('Hey!', this.messageResponse, 'success');
            }); */
          
          })
      }
    });
  }

  refreshdata(){
    if (!localStorage.getItem('refresh_data')) { 
      localStorage.setItem('refresh_data', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('refresh_data') 
    }
  }



}