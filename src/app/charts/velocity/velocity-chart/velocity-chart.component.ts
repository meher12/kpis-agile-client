import { Component, OnInit, ViewChild } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexTitleSubtitle
} from "ng-apexcharts";

import { Projet } from 'src/app/models/projet.model';
import { Sprint } from 'src/app/models/sprint.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

export type ChartOptions = {
  // series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

import Swal from 'sweetalert2';

@Component({
  selector: 'app-velocity-chart',
  templateUrl: './velocity-chart.component.html',
  styleUrls: ['./velocity-chart.component.css']
})

export class VelocityChartComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<any>;

  sprints: Sprint[];
  projects: Projet[];

  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;

  roles: string[] = [];

  workCommitment: number[] = [];
  workCompleted: number[] = [];
  sprintName: String[] = [];

  msgError = "";

  selected;

  constructor(private sprintService: SprintService, private projectService: ProjectService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.getAllproject();
      this.updateTablesprint();
      
    }

  }

  // update work Commitment and work Completed in sprint
  updateTablesprint(){
    this.sprintService.updateStoryPointInSprint()
    .subscribe(data => console.log(data));
  }

  getAllproject() {
    this.projectService.getProjectList()
      .subscribe(data => {
        this.projects = data;
      },
      err => {
        this.msgError = err.error.message;
        Swal.fire('Hey!', this.msgError, 'warning')
        console.error(this.msgError);
      });
  }


  //  get all Sprints by project reference
  getVelocityChartByProject(event: any) {
   
    this.sprintService.getAllSprintsByProjectRef(event.target.value)
      .subscribe(data => {
        this.sprints = data;
        console.log(this.sprints);

        var arraySize = Object.keys(this.sprints).length;
        for (var i = 0; i < arraySize; i++) {
          this.workCommitment[i] = this.sprints[i].workCommitment;
          this.workCompleted[i] = this.sprints[i].workCompleted;
          this.sprintName['' + i] = this.sprints[i].stitre;
        }
        
        this.velocityChart(this.workCommitment, this.workCompleted, this.sprintName);
      },

        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        });
  } 
 
  // velocity Chart
  velocityChart(wCommitment: number[], wCompleted: number[], xSprintName: String[]) {


    this.chartOptions = {
      series: [
        {
          name: "Commitment",
          data: this.workCommitment
        },
        {
          name: "Work completed",
          data: this.workCompleted
        }
      ],
      chart: {
        type: "bar",
        height: 'auto',
      },
      title: {
        text: 'Velocity Chart',
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
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          /* borderRadius: 10 */
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: this.sprintName,
        tickPlacement: 'on',
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
      yaxis: {
        title: {
          text: "Story points",
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
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "" + val + " Story points";
          }
        }
      }
    };


  }

}
