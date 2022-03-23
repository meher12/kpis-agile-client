import { Component, OnInit, ViewChild } from '@angular/core';

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



  firstSP: number[] = [];
  spTab: number[] = [];
  idealLineArray: string[];
/*   dataarray = [];
  dates: String[] = [];
  getDatesBetweenDates;
  endDate;
  startDate;
  totalSP;
  SP;
  nmuber_of_day;
  incrementValue;
  iterator; */

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
      this.updateTablesprint();
      this.initBrundownChart();

    }
  }

    //function
    arr = [];   // set array=[]
    empty = arr => arr.length = 0;




  // update work Commitment and work Completed in sprint
  updateTablesprint() {
    this.sprintService.updateStoryPointInSprint()
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

    this.sprintService.getSprintByReference(event.target.value)
      .subscribe(data => {
        this.sprintObject = data;
        //console.log(this.sprintObject)

       /*  this.totalSP = this.sprintObject.workCommitment;
        this.firstSP = [this.totalSP];


        //Difference in number of days
        this.endDate = moment(this.sprintObject.sdateFin);
        this.startDate = moment(this.sprintObject.sdateDebut);
        var nbrOfDay = moment.duration(this.endDate.diff(this.startDate)).asDays();


        this.SP = this.sprintObject.workCommitment;
        this.nmuber_of_day = Math.round(nbrOfDay);
        this.incrementValue = Math.round(this.SP / this.nmuber_of_day);


        for (var i = 0; i < this.nmuber_of_day; i++) {
          this.spTab[i] = this.SP - this.incrementValue
          this.spTab.push(this.spTab[i]);
          this.iterator = this.spTab.values();
          for (let elements of this.iterator) {
            this.SP = elements;
          }
        }
        this.idealLineArray = this.firstSP.concat(this.spTab);

        this.dataarray = this.PositiveArray(this.idealLineArray).slice(0, -1);

 */
        this.sprintObject.idealLinearray.pop()
        this.idealLineArray =    this.sprintObject.idealLinearray;
        this.sprintObject.daysarray.pop() 
        this.dateList = this.sprintObject.daysarray //this.getDateDayInArray(this.startDate, this.endDate);


        this.brunDownChart(this.idealLineArray, this.idealLineArray, this.dateList);


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
          data: this.idealLineArray
        },

        {
          name: "work",
          data: this.idealLineArray
        }

      ],
      chart: {
        height: 'auto',
        type: "line"
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


  // init brundown Chart
  initBrundownChart() {
    this.chartOptions = {
      series: [
        {
          name: "ideal",
          data: [75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0]
        },

        {
          name: "work",
          data: [65, 60, 55, 50, 38, 25, 10, 8, 5, 28, 23, 18, 13, 9, 4, 0]
        }

      ],
      chart: {
        height: 350,
        type: "line"
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
        text: "Page Statistics",
        align: "left"
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
        labels: {
          trim: false
        },
        categories: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16"
        ]
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + " (mins)";
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val + " per session";
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
  PositiveArray(numbers): number[] {
  
   
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
  }



}
