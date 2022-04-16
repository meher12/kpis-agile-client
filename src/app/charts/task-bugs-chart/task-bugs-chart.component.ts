import { Component, OnInit, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";
import { Projet, TaskBugs } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-task-bugs-chart',
  templateUrl: './task-bugs-chart.component.html',
  styleUrls: ['./task-bugs-chart.component.scss']
})
export class TaskBugsChartComponent implements OnInit {

  @ViewChild("taskBugchart") chart: ChartComponent;
  public chartOptions: Partial<any>;

  project: Projet = new Projet();
  projects: Projet[];

  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;

  roles: string[] = [];

  msgError = "";
  selected;


  taskBugsArrays: TaskBugs;
  dateArray: any[];
  bugIntaskArray: any[];
  tasksafeArray: any[];
 

  displayStyle = "none";

  constructor(private projectService: ProjectService, private tokenStorageService: TokenStorageService) { }


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
        },
        error: err => {
          this.msgError = err.error.message;
          console.error(this.msgError)
        }
      });
  }

    //get taskbug info
    getInfotaskBug(event: TaskBugs) {

      this.taskBugsArrays = event;
     // console.log(" ***********", this.taskBugsArrays);
      this.dateArray = this.taskBugsArrays.endDateArray;
      this.bugIntaskArray = this.taskBugsArrays.taskBugsArray;
      this.tasksafeArray = this.taskBugsArrays.taskSafe;
      this.taskBugChart(this.dateArray, this.bugIntaskArray, this.tasksafeArray );
      
    }

  taskBugChart(date: any[], bug: any[], tasksafe: any[]){
    this.chartOptions = {
      series: [
        {
          name: "Tasks",
          data: tasksafe
        },
        {
          name: "Bugs",
          data: bug
        }
      ],
      chart: {
        height: 'auto',
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: ["#77B6EA", "#545454"],
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "Cycle Time by period",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      
      xaxis: {
        categories: date,
        title: {
         // text: "Month"
        }
      },
      yaxis: {
        title: {
          text: "Task"
        },
       /*  min: 0,
        max: 20 */
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };
  }

  openPopup() {
    this.displayStyle = "block";
  }

  closePopup() {
    this.displayStyle = "none";
  }


}
