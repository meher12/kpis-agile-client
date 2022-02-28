import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-board-scrm',
  templateUrl: './board-scrm.component.html',
  styleUrls: ['./board-scrm.component.css']
})
export class BoardScrmComponent implements OnInit {

  content?: string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getModeratorBoard().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }
}
