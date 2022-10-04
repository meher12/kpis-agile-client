import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";



export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any; // ApexTooltip;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

import { Sprint } from 'src/app/models/sprint.model';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { TokenStorageService } from 'src/app/services/token-storage.service';


@Component({
  selector: 'app-burndown',
  templateUrl: './burndown.component.html',
  styleUrls: ['./burndown.component.css']
})



export class BurndownComponent implements OnInit {

  sprints: Sprint[];
  sprintObject: Sprint;
  msgError = "";
  selected;

  @Output() datePickedB = new EventEmitter<any>();

  workedStoryarray: string[];
  idealLineArray: any[];
  dateList: String[];


  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;

  roles: string[] = [];

  @ViewChild("brundownChart") chart: ChartComponent;
  public chartOptions: Partial<any>;


  constructor(private sprintService: SprintService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {

      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');
      this.getAllSprint();
      this.daysNumberInSprint();
      this.idealLineForSprint();
     
      this.updateTablesprint();
     // this.initBrundownChart();

    }
  }


  // update work Commitment and work Completed in sprint
  updateTablesprint() {
    this.sprintService.updateStoryPointInSprint()
      .subscribe(data => console.log(data));
  }

  //  get number of days in sprint
  daysNumberInSprint() {
    this.sprintService.daysInSprint()
      .subscribe(data => console.log(data));
  }

  //  get number of days in sprint
  idealLineForSprint() {
    this.sprintService.idealLineOfSprint()
      .subscribe(data => console.log(data));
  }


  // get sprint list
  getAllSprint() {
    this.sprintService.getAllSprints()
      .subscribe(data => {
        this.sprints = data;
      },
        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        });
  }

  // get sprint from select list and // generate data brundown chart
  generateDataChart(event: any) {

    this.daysNumberInSprint();
    this.idealLineForSprint();

    this.sprintService.getSprintByReference(event.target.value)
      .subscribe(data => {
        this.sprintObject = data;
        //console.log(this.sprintObject)

     
        this.sprintObject.idealLinearray.pop()
        this.idealLineArray = this.sprintObject.idealLinearray;

      /*  for (var i=0; i<this.idealLineArray.length; i++){
        this.idealLineArray[i] = Math.round(this.idealLineArray[i])
       } */

        this.sprintObject.workedlarray.pop();
        this.workedStoryarray =  this.sprintObject.workedlarray;

        this.sprintObject.daysarray.pop() 
        this.dateList = this.sprintObject.daysarray

        this.datePickedB.emit( this.sprintObject.supdatedDate);

        this.brunDownChart(this.idealLineArray, this.workedStoryarray, this.dateList);


      },

        err => {
          this.msgError = err.error.message;
          Swal.fire('Hey!', this.msgError, 'warning')
          console.error(this.msgError);
        });

  }



  // brundown Chart by sprint
  brunDownChart(idealLine: string[], workedDayLine: string[], workedDay: String[]) {
    // Start brundown Chart
    this.chartOptions = {
      series: [
        {
          name: "ideal",
          data: this.idealLineArray //[50, 45, 40, 35, 30, 25, 20, 15, 10, 5,0] 
        },

        {
          name: "work",
          data: this.workedStoryarray //[49, 43, 41, 33, 20, 10, 10, 8, 5 ]
        }

      ],
      chart: {
       // height: 'auto',
        //type: "line",
       
        toolbar: {
          export: {
            csv: {
              filename: "BrundownChart",
              //headerCategory: 'Date;',
              //columnDelimiter: ';',
              headerCategory: 'Date',
		          //headerValue: 'value'
              
            },
            svg: {
              filename: "BrundownChart",
            },
            png: {
              filename: "BrundownChart",
            }
          },
        }



        




      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 5,
        curve: "straight",
        dashArray: [0, 8, 5]
      },
      title: {
        text: 'Brundown Chart',
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
        tooltipHoverFormatter: function (val, opts) {
          return (
            val +
            " <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        categories: this.dateList,
        tickPlacement: 'on',
        labels: {
          trim: false,
          style: {
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
            colors: ['#000'],
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
        opacity: 10,
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + " (sp)";
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val + " per day";
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val;
              }
            }
          }
        ]
      },
      grid: {
        borderColor: "#f1f1f1"
      }
    };

  }




  // getDaysBetweenDates
 /*  getDateDayInArray(startDate, endDate): String[] {
   
    var now = startDate.clone();
    while (now.isSameOrBefore(endDate)) {
      this.dates.push(now.format('MM/DD/YYYY'));
      now.add(1, 'days');
    }
    console.log("-*-", this.dates)
    return this.dates;
    
  } */

  // return only positive array
/*   PositiveArray(numbers): number[] {
  
   
    var negatives: number[] = [];
    var positives: number[] = [];

    for (var i = 0; i < numbers.length; i++) {
      if (numbers[i] < 0) {
        negatives.push(numbers[i]);
      } else {
        positives.push(numbers[i]);
      }
    }
   // this.empty(numbers);
    console.log("data lenght", positives)
    return positives;
  } */



}
