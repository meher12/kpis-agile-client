import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-board-scrm',
  templateUrl: './board-scrm.component.html',
  styleUrls: ['./board-scrm.component.css']
})
export class BoardScrmComponent implements OnInit {

  content?: string;
  currenttotalSp: number;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
   /*  this.userService.getScrummBoard().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    ); */
  }

  getCurrenttotalsp(event){
    this.currenttotalSp = event;
    console.log("--this.currenttotalSp--", this.currenttotalSp);
  }
}
