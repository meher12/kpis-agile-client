import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Projet } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';

@Component({
  selector: 'app-projet-details',
  templateUrl: './projet-details.component.html',
  styleUrls: ['./projet-details.component.css']
})
export class ProjetDetailsComponent implements OnInit {


  id: number;
  project: Projet;
  constructor(private projectService: ProjectService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.project = new Projet();
    this.id = this.route.snapshot.params['id'];
    this.projectService.getProjectById(this.id)
      .subscribe(data => {
        this.project = data;
        console.log(this.project);
        
      },
      err => {
        console.error(err);
      }
      )
  }

}
