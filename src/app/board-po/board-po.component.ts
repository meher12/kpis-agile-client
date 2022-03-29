import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-board-po',
  templateUrl: './board-po.component.html',
  styleUrls: ['./board-po.component.css']
})
export class BoardPoComponent implements OnInit {

  content?: string;
  // myupdate?: string="";
  datePicked?: Date;
  onDatePicked?: string;

  datePickedV?: Date;
  onDatePickedV?: string;

  datePickedB?: Date;
  onDatePickedB?: string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getPoBoard().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );


  }


  public getUpdatedDateV(): void {
    this.onDatePickedV = moment(this.datePickedV).fromNow();
    console.log('Picked date: ', this.onDatePickedV);
  }

  public getUpdatedDateB(): void {
    this.onDatePickedB = moment(this.datePickedB).fromNow();
    console.log('Picked date: ', this.onDatePickedB);
  }

  public getUpdatedDate(): void {
    this.onDatePicked = moment(this.datePicked).fromNow();
    console.log('Picked date: ', this.onDatePicked);
  }
}