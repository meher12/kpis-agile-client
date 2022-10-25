import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import * as moment from "moment";

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
  ApexTitleSubtitle
} from "ng-apexcharts";

import { Projet } from "src/app/models/projet.model";
import { ProjectService } from "src/app/services/projects/project.service";
import { TokenStorageService } from "src/app/services/token-storage.service";

import Swal from 'sweetalert2';
import { SprintService } from "src/app/services/sprints/sprint.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};


@Component({
  selector: 'app-release-burndown',
  templateUrl: './release-burndown.component.html',
  styleUrls: ['./release-burndown.component.scss']
})
export class ReleaseBurndownComponent implements OnInit {


  @ViewChild("releaseBurndown") chart: ChartComponent;

  public chartOptions: Partial<any>;



  project: Projet = new Projet();
  projects: Projet[];

  pMorespF: string[] = [];
  pSpCommitmentF: any[] = [];
  pSpwrkedF: string[] = [];
  sprintName: String[] = [];

  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;

  roles: string[] = [];

  msgError = "";
  selected;

  newSp: string[] = [];
  remainingSp: any[] = [];
  doneSp: string[] = [];




  @Output() datePicked = new EventEmitter<any>();

  constructor(private projectService: ProjectService, private sprintService: SprintService, private tokenStorageService: TokenStorageService) { }



  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.getAllproject();
      this.updateTablesprint();
      // this.getUpdateAllsp();


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

  //update all sp
  /*  getUpdateAllsp() {
     this.projectService.updateAllSp().subscribe(data => console.log(data));
   } */
  // update work Commitment and work Completed in sprint
  updateTablesprint() {
    this.sprintService.updateStoryPointInSprint()
      .subscribe(data => console.log(data));
  }

  // release brundown chart update data in backend
  /* pReleaseBurndownChart(refproject: string) {

    // Reload release chart
    if (!localStorage.getItem('release_chart')) {
      localStorage.setItem('release_chart', 'no reload')
      location.reload()
    } else {
      localStorage.removeItem('release_chart')
    }

     this.projectService.releasebdchart(refproject)
      .subscribe(data => console.log(data)); 
  } */





  //  get release Brundown Chart project reference
  getReleaseBrundownChartByProject(event: any) {

    // this.pReleaseBurndownChart(event.target.value);


    this.projectService.getProjectByReference(event.target.value)
      .subscribe(data => {
        this.project = data;
        // console.log("get release burndown chart data from project", this.project);

        // sort sprints array
        const newarr = this.project.sprints.sort((a, b) => {
          return moment(a.sdateDebut).diff(b.sdateDebut);
        });

        // get sprint array length
        var arraySize = Object.keys(newarr).length;

        this.sprintName.length = 0;
        for (var i = 0; i < arraySize; i++) {

          this.sprintName[i] = this.project.sprints[i].stitre;
        }

        this.projectService.releasebdchart(event.target.value)
          .subscribe(data => {

            this.doneSp = data.doneSp;
            this.newSp = data.newSp;
            this.remainingSp = data.remainingSp
           console.log(this.doneSp + " **" + this.newSp + "**" +this.remainingSp)
          // let valArrtoNumber = this.valueArr.map(i => Number(i));
          this.relaseBrundounChart(this.remainingSp, this.doneSp, this.newSp, this.sprintName)
           
          })
 

        this.datePicked.emit(this.project.pupdatedDate);


      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        });
  }

  relaseBrundounChart(spcommitment: any[], spworked: any[], spmore: any[], sprintname: any[]) {

   // sprintname.push("Remaining story points");
   sprintname.push("Next sprint");

    /* Start Chart*/
    this.chartOptions = {
      series: [
        {
          name: "Remaining",
          data: spcommitment  //[85, 61, 40, 33, 0] //[85, 61, 40, 18, 10]
        },
        {
          name: "Done",
          data: spworked //[24, 21, 22, 33]  //[24, 21, 22, 18]
        },
        {
          name: "New",
          data: spmore //[0, 0, 15, 0] //[0, 0, 10, 0]
        }
      ],
      chart: {
        
        type: "bar",
        height: 'auto',
        stacked: true,
        toolbar: {
          show: true,
          export: {
            csv: {
              filename: "ReleaseBurndownChart",
              //headerCategory: 'Date;',
              //columnDelimiter: ';',
              headerCategory: 'Sprint',
              //headerValue: 'value'

            },
            svg: {
              filename: "ReleaseBurndownChart",
            },
            png: {
              filename: "ReleaseBurndownChart",
            }
          },
        },
        zoom: {
          enabled: true
        }
      },
      title: {
        text: 'Release burndown Chart',
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
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      /*  xaxis: {
         type: "category",
         categories: sprintname, //['sprint 1', 'sprint 2', 'sprint 3', 'sprint 4', 'release sprint'],
         tickPlacement: 'on',
 
       }, */
      xaxis: {
        type: "category",
        categories: sprintname,
        tickPlacement: 'on',
        labels: {
          rotate: -45,
          rotateAlways: true,
          /*  minHeight: 100,
           maxHeight: 200,  */
          style: {
            colors: [],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            cssClass: 'apexcharts-xaxis-label',
          }
        }
      },
      grid: {
        margin: {
          //left: 0,
          //right: 0,
          bottom: 500
        }
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      /*  yaxis: {
         show: true,
         showAlways: true,
         title: {
           text: "Story points",
           style: {
             colors: [],
             fontSize: '10px',
             fontFamily: 'Helvetica, Arial, sans-serif',
             fontWeight: 'bold',
             cssClass: 'apexcharts-xaxis-label',
           }
         },
         labels: {
           show: true,
           style: {
             colors: [],
             fontSize: '10px',
             fontFamily: 'Helvetica, Arial, sans-serif',
             fontWeight: 'bold',
             cssClass: 'apexcharts-xaxis-label',
           }
         }
 
       }, */
      legend: {
        position: "right",
        offsetY: 40
      },
      fill: {
        // opacity: 1,
        colors: ['#003366', '#01DF3A', '#D7DF01']
      }

    };


  }

  /* End Chart */





}
