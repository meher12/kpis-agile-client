import { Component, OnInit, ViewChild } from '@angular/core';

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexLegend,
  ApexResponsive,
  ChartComponent
} from "ng-apexcharts";
import { Projet } from 'src/app/models/projet.model';
import { Sprint } from 'src/app/models/sprint.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from 'sweetalert2';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive | ApexResponsive[];
};


@Component({
  selector: 'app-sp-done-by-project',
  templateUrl: './sp-done-by-project.component.html',
  styleUrls: ['./sp-done-by-project.component.scss']
})
export class SpDoneByProjectComponent implements OnInit {

  @ViewChild("storyPointsCChart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  sprints: Sprint[];
  projects: Projet[];
  project: Projet;

  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;

  roles: string[] = [];

  percentageArray: any[];
  sprintName: any[] = [];

  msgError = "";
  selected;


  _totalsp: any;
  //Getter and Setters
  get totalsp() { return this._totalsp };
  set totalsp(value: string) { //debugger;
    this._totalsp= value;
  }

  constructor(private sprintService: SprintService, private projectService: ProjectService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.getAllproject();
     // this.initStoryPointsCChart();
      this.projectService.percentageSpCByproject();

    }

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

// get chart by project
getStoryPointsCChart(event: any) {

  this.projectService.getProjectByReference(event.target.value)
  .subscribe(data => {
    this.project = data;
    console.log(this.project);

   this.project.percentage_spc.pop();
   this.percentageArray = this.project.percentage_spc;

   var arraySize = Object.keys(this.project.sprints).length;
   for (var i = 0; i < arraySize; i++) {
     this.sprintName[i] = this.project.sprints[i].stitre;
   }

  this._totalsp = this.project.totalspCommitment;

  this.radioChartByPr(this.percentageArray, this.sprintName, this._totalsp);
 
    },
    err => {
      this.msgError = err.error.message;
      Swal.fire('Hey!', this.msgError, 'warning')
      console.error(this.msgError);
    });
}

// Chart by project
radioChartByPr(percentageArray: any[], sprintName: any[],  totalsp: string){

   /* Start Chart */
   this.chartOptions = {
    series: this.percentageArray,
    chart: {
      height: 'auto',
      type: "radialBar",
      toolbar: {
        show: true,
    
      }
    },
    title: {
      text: 'Story Points Completed Chart',
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
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "20px",
            show: true
          },
          value: {
            fontSize: "16px",
            show: true
          },
          total: {
            show: true,
            label: "Total",
            formatter: function (num: any) {
              return  totalsp;
            }
          }
        },

        offsetY: 0,
        startAngle: 0,
        //endAngle: 220,
        hollow: {
          margin: 5,
          size: "30%",
         background: "transparent",
         image: undefined
        },

      }
    },
    // colors: ["#AA4A44", "#0084ff", "#39539E", "#0077B5"],
    labels:  this.sprintName, 
    legend: {
      show: true,
      floating: true,
      fontSize: "15px",
      position: "bottom",
      offsetX: 10,
      offsetY: 30,
      labels: {
        useSeriesColors: true
      },
      formatter: function (seriesName, opts) {
        //return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        return seriesName ;
      },
      itemMargin: {
        horizontal: 3
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false
          }
        }
      }
    ]
  };
     /* End Chart */
}
// init chart
  initStoryPointsCChart() {
    this.chartOptions = {
      series: [40.83, 25, 50.5, 45.67, 65],
      chart: {
        height: 'auto',
        type: "radialBar",
        toolbar: {
          show: true,
         /*  offsetX: 10,
          offsetY: 10,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
          } */
        }
      },
      title: {
        text: 'Story Points Completed Chart',
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
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "20px",
              show: true
            },
            value: {
              fontSize: "16px",
              show: true
            },
            total: {
              show: true,
              label: "Total",
              formatter: function (w) {
                return "120";
              }
            }
          },

          offsetY: 0,
          startAngle: 0,
          //endAngle: 220,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined
          },

        }
      },
      // colors: ["#AA4A44", "#0084ff", "#39539E", "#0077B5"],
      labels:  this.sprintName, 
      legend: {
        show: true,
        floating: false,
        fontSize: "10px",
        position: "left",
        offsetX: 50,
        offsetY: 50,
        labels: {
          useSeriesColors: true
        },
        formatter: function (seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
          horizontal: 3
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false
            }
          }
        }
      ]
    };
  }
}
