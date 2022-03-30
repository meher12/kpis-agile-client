import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
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


  project: Projet;
  projects: Projet[];

  pMorespF: string[] = [];
  pSpCommitmentF: string[] = [];
  pSpwrkedF: string[] = [];
  sprintName: String[] = [];

  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;

  roles: string[] = [];

  msgError = "";
  selected;


  @Output() datePicked = new EventEmitter<any>();

  constructor(private projectService: ProjectService, private tokenStorageService: TokenStorageService) { }


  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.getAllproject();
      this.projectService.updateStoryPointsInproject();
      this.projectService.releasebdchart();
      this.initReleaseBurndownChart(); 

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


  //  get release Brundown Chart project reference
  getreleaseBrundownChartByProject(event: any) {
    this.projectService.getProjectByReference(event.target.value)
      .subscribe(data => {
        this.project = data;
        console.log(this.project);

        this.project.pSpCommitment.pop();
        this.pSpCommitmentF = this.project.pSpCommitment;

        this.project.pSpwrked.pop();
        this.pSpwrkedF = this.project.pSpwrked;

        this.project.pMoresp.pop();
        this.pMorespF = this.project.pMoresp;


        var arraySize = Object.keys(this.project.sprints).length;
        for (var i = 0; i < arraySize; i++) {
          this.sprintName['' + i] = this.project.sprints[i].stitre;
        }
        this.sprintName.push("release sprint")

        this.datePicked.emit(this.project.pupdatedDate);

        /* Start Chart*/
        this.chartOptions = {
          series: [
            {
              name: "Total story points",
              data: this.pSpCommitmentF
            },
            {
              name: "Completed story point",
              data: this.pSpwrkedF
            },
            {
              name: "New task",
              data: this.pMorespF
            }
          ],
          chart: {
            type: "bar",
            height: 'auto',
            stacked: true,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true
            }
          },
          title: {
            text: 'Release brundoun Chart',
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
          xaxis: {
            type: "category",
            categories: this.sprintName
          },
          legend: {
            position: "right",
            offsetY: 40
          },
          fill: {
            opacity: 1,
            colors: ['#B40404', '#01DF3A', '#D7DF01']
          }

        };

        /* End Chart */
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        });
  }


  // init release brundown chart
   initReleaseBurndownChart() {
     this.chartOptions = {
       series: [
         {
           name: "Total story points",
           data: [100, 90, 85, 75, 40, 35, 15]
         },
         {
           name: "Completed story point",
           data: [10, 10, 10, 10, 10, 10, 10]
         },
         {
           name: "New task",
           data: [0, 0, 0, 15, 0, 0]
         }
       ],
       chart: {
         type: "bar",
         height: 350,
         stacked: true,
         toolbar: {
           show: true
         },
         zoom: {
           enabled: true
         }
       },
       title: {
        text: 'Release brundoun Chart',
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
       xaxis: {
         type: "category",
         categories: this.sprintName
       },
       legend: {
         position: "right",
         offsetY: 40
       },
       fill: {
         opacity: 1,
         colors: ['#B40404', '#01DF3A', '#D7DF01']
       }
 
     };
   }

}
