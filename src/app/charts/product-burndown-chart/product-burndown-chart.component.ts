import { Component, OnInit, ViewChild } from '@angular/core';
import { Projet } from 'src/app/models/projet.model';
import { ProjectService } from 'src/app/services/projects/project.service';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from 'sweetalert2';
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
  selector: 'app-product-burndown-chart',
  templateUrl: './product-burndown-chart.component.html',
  styleUrls: ['./product-burndown-chart.component.scss']
})
export class ProductBurndownChartComponent implements OnInit {

  @ViewChild("productBurndown") chart: ChartComponent;

  public chartOptions: Partial<any>;

  project: Projet = new Projet();
  projects: Projet[];

  newSp: string[] = [];
  remainingSp: any[] = [];
  doneSp: string[] = [];
  sprintName: String[] = [];

  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;

  roles: string[] = [];

  msgError = "";
  selected;

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

  // product burndown chart update data in backend
 /*  updateProductBurndownChart(refproject: string) {

    // Reload product chart
    if (!localStorage.getItem('product_chart')) {
      localStorage.setItem('product_chart', 'no reload')
      location.reload()
    } else {
      localStorage.removeItem('product_chart')
    }

    this.projectService.getProductBurndownChart(refproject)
      .subscribe(data => console.log(data));
  }
 */

  // ************
  //  get product Brundown Chart project reference
  getreleaseBrundownChartByProject(event: any) {

    //this.updateProductBurndownChart(event.target.value);

    this.projectService.getProjectByReference(event.target.value)
      .subscribe(data => {
        this.project = data;
        console.log("get product burndown chart data from project", this.project);

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
        this.projectService.getProductBurndownChart(event.target.value)
          .subscribe(data => {
            this.doneSp = data.doneSp;
            this.newSp = data.newSp;
            this.remainingSp = data.remainingSp
           console.log(this.doneSp + " **" + this.newSp + "**" +this.remainingSp)
          // let valArrtoNumber = this.valueArr.map(i => Number(i));
          this.productBrundounChart(this.remainingSp, this.doneSp, this.newSp, this.sprintName)

          })

       
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        });
  }

  // ***************

  productBrundounChart(remainingSp: any[], doneSp: any[], newSp: any[], sprintname: any[]) {

    sprintname.unshift("sprint 0");


    /* Start Chart*/
    this.chartOptions = {
      series: [
        {
          name: "Remaining",
          data: remainingSp  //[85, 61, 40, 33, 0] //[85, 61, 40, 18, 10]
        },
        {
          name: "Done",
          data: doneSp //[24, 21, 22, 33]  //[24, 21, 22, 18]
        },
        {
          name: "New",
          data: newSp //[0, 0, 15, 0] //[0, 0, 10, 0]
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
              filename: "ProductBurndownChart",
              //headerCategory: 'Date;',
              //columnDelimiter: ';',
              headerCategory: 'Sprint',
              //headerValue: 'value'

            },
            svg: {
              filename: "ProductBurndownChart",
            },
            png: {
              filename: "ProductBurndownChart",
            }
          },
        },
        zoom: {
          enabled: true
        }
      },
      title: {
        text: 'Product burndown Chart',
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
        categories: sprintname,
        tickPlacement: 'on',
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
