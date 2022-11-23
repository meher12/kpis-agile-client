import { Component, OnInit, ViewChild } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexChart,
  ApexXAxis,
  ApexFill,
  ApexDataLabels,
  ChartComponent,
  ApexStroke,
  ApexPlotOptions,
  ApexYAxis,
  ApexMarkers
} from "ng-apexcharts";
import { Projet } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  tooltip: any;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
  yaxis: ApexYAxis;
  markers: ApexMarkers;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-radar-sattus-task-chart',
  templateUrl: './radar-sattus-task-chart.component.html',
  styleUrls: ['./radar-sattus-task-chart.component.scss']
})
export class RadarSattusTaskChartComponent implements OnInit {

  @ViewChild("radarChart") chart: ChartComponent;
  public chartOptions: Partial<any>;



  projects: Projet[];

  keyArr: any[] = [];
  valueArr: any[] = [];


  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;

  roles: string[] = [];

  msgError = "";
  selected;

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



  getStatuslist(event: any) {
    this.projectService.getListtaskByStatus(event.target.value)
      .subscribe(
        {
          next: (data) => {
            const { KeyArr, ValueArr } = data;

            this.keyArr = KeyArr
            this.valueArr = ValueArr
            //console.log("two arrays", this.keyArr);
            //console.log("**** rays", this.valueArr);

            let valArrtoNumber = this.valueArr.map(i => Number(i));
            //console.log(valArrtoNumber);

            this.radarChart(this.keyArr, valArrtoNumber)
          },

          error: err => console.error(err),
          //complete: () => console.log('DONE!')


        })

  }



  radarChart(statusTask: any[], countStatus: any[]) {

    this.chartOptions = {
      series: [
        {
          
          data: countStatus
        }
      ],
      chart: {
        height: 380,
        type: "radar",

        toolbar: {
          show: true,
          export: {
            csv: {
              filename: "TaskStatusCountChart",
              //headerCategory: 'Date;',
              //columnDelimiter: ';',
              headerCategory: 'Status',
		          headerValue: 'value'
              
            },
            svg: {
              filename: "TaskStatusCountChart",
            },
            png: {
              filename: "TaskStatusCountChart",
            }
          }
        }
  
      },
      dataLabels: {
        enabled: true
      },
      plotOptions: {
        radar: {
          size: 150,
          polygons: {
            strokeColor: "#e9e9e9",
            fill: {
              colors: ["#f8f8f8", "#fff"]
            }
          }

        }
      },

      colors: ["#FF4560"],
      markers: {
        size: 4,
        colors: ["#fff"],
        strokeColors: ["#FF4560"],
        strokeWidth: 2
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          }
        }
      },
      xaxis: {
        categories: statusTask,
        labels: {
          style: {
            colors: [],
            fontSize: '15px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            //cssClass: 'apexcharts-xaxis-label',
          },
        },

      },
      yaxis: {
        tickAmount: 7,
        labels: {
          formatter: function (val, i) {
            if (i % 2 === 0) {
              return val;
            } else {
              return "";
            }
          }
        }
      },
      title: {
        text: "Count of task status",
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
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }



}
