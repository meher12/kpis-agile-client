import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-board-scrm',
  templateUrl: './board-scrm.component.html',
  styleUrls: ['./board-scrm.component.css']
})
export class BoardScrmComponent implements OnInit {

  content?: string;
  currenttotalSp: any;
  SpObject: any;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
  
  }

  getTotalsp(event){
    this.currenttotalSp = event.SpCompleted;
   // this.commitmenttotalSp = event.SpCommitment;
   this.SpObject = event;
    console.log("--object d--", event);
   /* console.log("--this.currenttotalSp--", this.currenttotalSp);
    console.log("--commitmenttotalSp--", this.commitmenttotalSp);*/
  }

}
