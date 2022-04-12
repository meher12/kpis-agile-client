import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import * as moment from "moment";
import { asapScheduler } from "rxjs";
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
      this.updateTablesprint()
      this.getUpdateAllsp()
     

    }

  }

  //update all sp
  getUpdateAllsp(){
    this.projectService.updateAllSp().subscribe(data => console.log(data));
  }
   // update work Commitment and work Completed in sprint
   updateTablesprint() {
    this.sprintService.updateStoryPointInSprint()
      .subscribe(data => console.log(data));
  }

  // brundown chart update data in backend
  pReleaseBurndownChart(refproject: string) {
    this.projectService.releasebdchart(refproject)
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


  //  get release Brundown Chart project reference
  getreleaseBrundownChartByProject(event: any) {

    this.pReleaseBurndownChart(event.target.value);


    this.projectService.getProjectByReference(event.target.value)
      .subscribe(data => {
        this.project = data;
        console.log(this.project);

        this.project.pSpCommitment.pop();
        // this.project.pSpCommitment.pop();
        this.pSpCommitmentF = this.project.pSpCommitment;

        this.project.pSpwrked.pop();
        this.pSpwrkedF = this.project.pSpwrked;

        this.project.pMoresp.pop();
        this.pMorespF = this.project.pMoresp;

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
        

        this.datePicked.emit(this.project.pupdatedDate);

        this.relaseBrundounChart(this.pSpCommitmentF, this.pSpwrkedF, this.pMorespF, this.sprintName)

      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        });
  }

  relaseBrundounChart(spcommitment: any[], spworked: any[], spmore: any[], sprintname: any[]) {
   
    sprintname.push("release sprint");
    
    /* Start Chart*/
    this.chartOptions = {
      series: [
        {
          name: "Total story points",
          data: spcommitment
        },
        {
          name: "Completed story point",
          data: spworked
        },
        {
          name: "New task",
          data: spmore
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
        categories: sprintname,
        tickPlacement: 'on',

      },
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
