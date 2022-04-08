import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Efficacity, Projet } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  yaxis: ApexYAxis;
};

@Component({
  selector: 'app-efficacity-chart',
  templateUrl: './efficacity-chart.component.html',
  styleUrls: ['./efficacity-chart.component.scss']
})
export class EfficacityChartComponent implements OnInit {

  @ViewChild("efficacityChart") chart: ChartComponent;
  public chartOptions: Partial<any>;

  project: Projet = new Projet();
  projects: Projet[];


  pSpwrkedF: string[] = [];
  sprintName: String[] = [];

  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;

  roles: string[] = [];

  msgError = "";
  selected;
  id: number;

  newEfficacityArrays: Efficacity;
  dateArray: any[];
  efficacityArray: any[];

  displayStyle = "none";

  @Output() currentTotalSpChange = new EventEmitter<number>();
  constructor(private projectService: ProjectService, private tokenStorageService: TokenStorageService, private router: Router) { }


  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.getAllproject();

    }
  }

  getAllproject() {
    this.projectService.getProjectList()
      .subscribe(data => {
        this.projects = data;
      },
        err => {
          this.msgError = err.error.message;
          console.error(this.msgError);
        });
  }

  //  get release Brundown Chart project reference
  getModelByProjectRef(event: any) {
    this.projectService.getProjectByReference(event.target.value)
      .subscribe({
        next: (data) => {
          this.project = data;
          this.currentTotalSpChange.emit(this.project.totalspCommitment);
          // console.log("----",this.project);
          // this.id = this.project.id;
          // console.log("----",this.id);
        },
        error: err => {
          this.msgError = err.error.message;
          console.error(this.msgError)
        }
      });
  }

  //get velocity info
  getInfoEfficacity(event: Efficacity) {

    this.newEfficacityArrays = event;
    this.dateArray = this.newEfficacityArrays.KeyArr;
    this.efficacityArray = this.newEfficacityArrays.FloatArr;
    //console.log("efficacity ***********", this.efficacityArray);
    //console.log("Date ***********", this.dateArray);

    let efficacityArrayNumber = this.efficacityArray.map(i=>Math.round(i));
    //console.log(" ***********", efficacityArrayNumber);
    this.efficacityChart(this.dateArray, efficacityArrayNumber);
    
  }

  efficacityChart(dateReq: any[], efficacityReq: any[]){
    this.chartOptions = {
      series: [
        {
          name: "Efficacity",
          data: efficacityReq
        }
      ],
      chart: {
        height: 'auto',
        type: "line",
        zoom: {
          enabled: false
        },
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: 'Efficacity Chart',
        align: 'center',
        margin: 30,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
          fontFamily: 'Helvetica, Arial, sans-serif',
          color: '#263238'
        }
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: dateReq, 
        
      },
      yaxis: {
        title: {
          text: "Efficacity",
          style: {
            colors: [],
            fontSize: '15px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            cssClass: 'apexcharts-xaxis-label',
          }
        },
        labels: {
          style: {
            colors: [],
            fontSize: '15px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            cssClass: 'apexcharts-xaxis-label',
          }
        }

      },
    };
  }
  openPopup() {
    this.displayStyle = "block";
  }

  closePopup() {
    this.displayStyle = "none";
  }

}
