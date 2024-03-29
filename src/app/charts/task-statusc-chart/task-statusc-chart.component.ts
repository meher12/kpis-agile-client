import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexTheme,
  ApexTitleSubtitle
} from "ng-apexcharts";
import { Projet } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  theme: ApexTheme;
  title: ApexTitleSubtitle;
};



@Component({
  selector: 'app-task-statusc-chart',
  templateUrl: './task-statusc-chart.component.html',
  styleUrls: ['./task-statusc-chart.component.scss']
})
export class TaskStatuscChartComponent implements OnInit {

  @ViewChild("taskStatusChart") chart: ChartComponent;
  public chartOptions: Partial<any>;

  pairArrays: Object;
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
     // this.taskStatusChartService('PUID10E1E');
      
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

 /*  taskStatusChartService(refproject: string) {
    this.projectService.getListtaskByStatus(refproject)
      .subscribe(data => console.log(data));
  } */

  // get status task percentage by project
  taskStatusChart(event: any) {

    this.projectService.getListtaskByStatus(event.target.value)
      .subscribe(
        {
          next: (data) => {
            const { KeyArr, ValueArr } = data;

            this.keyArr = KeyArr 
            this.valueArr = ValueArr 
            console.log("keyArr status label", this.keyArr);
            //console.log("**** rays", this.valueArr);

            let valArrtoNumber = this.valueArr.map(i=>Number(i));
            console.log("count percentage for status label",valArrtoNumber);

            this.getChartStatus(this.keyArr, valArrtoNumber)
          },

          error: err => console.error(err),
          //complete: () => console.log('DONE!')


        })
  
  }
// Show  status task by project
  getChartStatus(statusTask: any[], countStatus: any[]){
    this.chartOptions = {
      series: countStatus, //auto percentage
      chart: {
        width: "100%",
        type: "pie",

        toolbar: {
          show: true,
          export: {
            csv: {
              filename: "TaskStatusChart",
              //headerCategory: 'Date;',
              //columnDelimiter: ';',
              headerCategory: 'Status',
		          //headerValue: 'value'
              
            },
            svg: {
              filename: "TaskStatusChart",
            },
            png: {
              filename: "TaskStatusChart",
            }
          }
        }
      },
      labels: statusTask,
      theme: {
        monochrome: {
          enabled: false
        }
      },
      title: {
        text: "Percentage of task status",
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
      legend: {
        position: "right",
        offsetY: 40,
        horizontalAlign: "right",
       /*  floating: true,
        offsetY: -25,
        offsetX: -5 */
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
