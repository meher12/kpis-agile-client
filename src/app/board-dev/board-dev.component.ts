import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-board-dev',
  templateUrl: './board-dev.component.html',
  styleUrls: ['./board-dev.component.css']
})
export class BoardDevComponent implements OnInit {

  content?: string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserBoard().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }
}