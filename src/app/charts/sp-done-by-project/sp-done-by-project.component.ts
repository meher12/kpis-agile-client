import { Component, AfterViewInit, ViewChild } from '@angular/core';
import * as moment from 'moment';

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
export class SpDoneByProjectComponent implements AfterViewInit {

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

  ngAfterViewInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.getAllproject();

      
 
      //this.getArrayOfPercentage();

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

  getArrayOfPercentage(refproject: string){
    this.projectService.percentageSpCByproject(refproject)
    .subscribe(data => console.log(data));
  
  }

// get chart percentage SP by project
getStoryPointsCChart(event: any) {

  this.getArrayOfPercentage(event.target.value);

  this.projectService.getProjectByReference(event.target.value)
  .subscribe(data => {
    this.project = data;
    console.log("percentage SP by project",this.project);

   this.project.percentage_spc.pop();
   this.percentageArray = this.project.percentage_spc;

     // sort sprints array
     const newarr = this.project.sprints.sort((a, b) => {
      return moment(a.sdateDebut).diff(b.sdateDebut);
    });

    // get sprint length
    var arraySize = Object.keys(newarr).length;
    
    this.sprintName.length = 0;
    for (var i = 0; i < arraySize; i++) {

      this.sprintName[i] = this.project.sprints[i].stitre;
    }

  this._totalsp = this.project.totalstorypointsinitiallycounts;

  this.radioChartByPr(this.percentageArray, this.sprintName, this._totalsp);
 
    },
    err => {
      this.msgError = err.error.message;
      Swal.fire('Hey!', this.msgError, 'warning')
      console.error(this.msgError);
    });
}

// Show chart percentage SP by project
radioChartByPr(percentageTab: any[], sprintNom: any[],  totalsp: any){

   /* Start Chart */
   
   this.chartOptions = {
    series: percentageTab,
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
            formatter: function (w) {
              return  totalsp;
            }
          }
        },

        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "30%",
         background: "transparent",
         image: undefined
        },

      }
    },
    // colors: ["#AA4A44", "#0084ff", "#39539E", "#0077B5"],
    labels:  sprintNom, 
    legend: {
      show: true,
      floating: true,
      fontSize: "15px",
      position: "left",
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



}


