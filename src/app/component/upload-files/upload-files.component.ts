import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';


@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss']
})
export class UploadFilesComponent implements OnChanges, OnInit {

  ngOnChanges(changes: SimpleChanges): void {
    this.fileInfos = this.uploadService.getFiles();
  }
  ngOnInit(): void {
    // this.fileInfos = this.uploadService.getFiles();
  }

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  fileName;

  constructor(private uploadService: FileUploadService) { }
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
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
              this.fileInfos = this.uploadService.getFiles();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;
            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
            this.currentFile = undefined;
          }
        });
      }
      this.selectedFiles = undefined;
    }
  }

  deleteFile(url: string) {
    var path = url;
    var directories = path.split("/");
    var lastDirecotry = directories[(directories.length - 1)];
    this.uploadService.deleteFileById(lastDirecotry)
    .subscribe(data => {console.log(data)})
    this.fileInfos = this.uploadService.getFiles();
  }

  deleteFilebyName(file: any) {
    var path = file.url;
    var directories = path.split("/");
    var id = directories[(directories.length - 1)];
    this.uploadService.deleteFileByName(file.name, id)
    .subscribe(data => {console.log(data)})
    this.fileInfos = this.uploadService.getFiles();
  }

 

}