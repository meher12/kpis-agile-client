import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
import { Sprint, Velocity } from 'src/app/models/sprint.model';
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

  velocity: Velocity;

  @Output() velocityChange = new EventEmitter<Velocity>()
  @Output() datePickedV = new EventEmitter<any>();

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
  updateTablesprint() {
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

    this.updateTablesprint();

    // get info  of sprint by avg velocity -- number_sprint, average_velocity, capacity_story_points_in_next_sprint
    this.sprintService.getNumberOfSprintByVelocity(event.target.value)
      .subscribe(response => {
        this.velocity = response;
        this.velocityChange.emit(this.velocity);
        console.log("velocity Info: ", this.velocity);

      },
        error => {
          console.log(error);
        });


    // get bar chart sprint velocity 
    this.sprintService.getAllSprintsByProjectRef(event.target.value)
      .subscribe(data => {
        this.sprints = data;
        console.log(this.sprints);


        var arraySize = Object.keys(this.sprints).length;
        this.sprintName.length = 0;
        for (var i = 0; i < arraySize; i++) {
          this.workCommitment[i] = this.sprints[i].workCommitment;
          this.workCompleted[i] = this.sprints[i].workCompleted;
          this.sprintName['' + i] = this.sprints[i].stitre;
        }
        this.datePickedV.emit(this.sprints[0].supdatedDate);


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
          name: "Remaining",
          data: this.workCommitment  //[40,25,45,30]
        },
        {
          name: "Done",
          data: this.workCompleted //[35,25,43,29]
        }
      ],
      chart: {
        type: "bar",
        toolbar: {
          export: {
            csv: {
              filename: "VelocityChart",
              //headerCategory: 'Date;',
              //columnDelimiter: ';',
              headerCategory: 'Sprint',
              //headerValue: 'value'

            },
            svg: {
              filename: "VelocityChart",
            },
            png: {
              filename: "VelocityChart",
            }
          },
        },
        zoom: {
          enabled: true
        }

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
        type: "category",
        categories: this.sprintName,
        tickPlacement: 'on',
        labels: {
          rotate: -20,
          rotateAlways: true,
          style: {
            colors: [],
            fontSize: '12px',
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
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            cssClass: 'apexcharts-xaxis-label',
          }
        },
        labels: {
          style: {
            colors: [],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            cssClass: 'apexcharts-xaxis-label',
          }
        }

      },
      legend: {
        position: "right",
        offsetY: 40
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
      },
      /* responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 400
            },
            legend: {
              position: "right"
            }
          }
        }
      ] */
    };
  }


}
