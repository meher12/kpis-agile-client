import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Velocity } from '../models/sprint.model';
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

  newInfoVelocity: Velocity;

  numberSprint: number;
  averageVelocity: number;
  capacitySPNextSprint: number;

  statusBox;


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
   // console.log('Picked date: ', this.onDatePickedV);
  }

  public getUpdatedDateB(): void {
    this.onDatePickedB = moment(this.datePickedB).fromNow();
   // console.log('Picked date: ', this.onDatePickedB);
  }

  public getUpdatedDate(): void {
    this.onDatePicked = moment(this.datePicked).fromNow();
   // console.log('Picked date: ', this.onDatePicked);
  }

  //get velocity info
  getInfoVelocity(event: Velocity){

    this.newInfoVelocity = event;
    this.statusBox = true;
    
    this.averageVelocity =  Math.round(this.newInfoVelocity[0].average_velocity);
    this.capacitySPNextSprint = Math.round(this.newInfoVelocity[1].capacity_story_points_in_next_sprint);
    this.numberSprint = Math.round(this.newInfoVelocity[2].number_sprint);

    //console.log("New Velocity ***********", this.averageVelocity , this.capacitySPNextSprint , this.numberSprint);
  }
}