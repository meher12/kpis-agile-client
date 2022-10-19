import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sprint } from 'src/app/models/sprint.model';
import { Story } from 'src/app/models/story.model';
import { SprintService } from 'src/app/services/sprints/sprint.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import * as moment from 'moment';

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

import Swal from 'sweetalert2';

@Component({
  selector: 'app-sprint-details',
  templateUrl: './sprint-details.component.html',
  styleUrls: ['./sprint-details.component.css']
})
export class SprintDetailsComponent implements OnInit {

  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;
  roles: string[] = [];
  msgError = "";

  id: number;
  sprint: Sprint;
  stories: Story[];
  storiesSorted: Story[];

  idealLine: string[];
  workedLine: string[];
  dayinsprint: string[];

  displayStyle = "none";

  @ViewChild("brundownChartBySprint") chart: ChartComponent;
  public chartOptions: Partial<any>;

  constructor(private sprintService: SprintService, private route: ActivatedRoute,
    private tokenStorageService: TokenStorageService, private router: Router) { }





  ngOnInit(): void {

    if (!localStorage.getItem('sprint_data')) {
      localStorage.setItem('sprint_data', 'no reload')
      location.reload()
    } else {
      localStorage.removeItem('sprint_data')
    }

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

      this.sprint = new Sprint();
      this.id = this.route.snapshot.params['id'];
      //localStorage.setItem('id', this.id.toString());
      this.sprintService.getSprintById(this.id)
        .subscribe(data => {
          this.sprint = data;
          this.stories = this.sprint.stories;

           //*************** */
           var storyNotStored = this.sprint.stories;
           // sort sprints array
           this.storiesSorted = storyNotStored.sort((a, b) => {
             return moment(a.priority).diff(b.priority);
           });
           //**************** */

          // arrays of brundown chart
          this.sprint.idealLinearray.pop();
          this.idealLine = this.sprint.idealLinearray;

          this.sprint.workedlarray.pop();
          this.workedLine = this.sprint.workedlarray;

          this.sprint.daysarray.pop();
          this.dayinsprint = this.sprint.daysarray;

        /*   console.log(this.sprint);

          console.log("Ideal line" + this.idealLine);
          console.log("worked line" + this.workedLine);
          console.log("sprint day" + this.dayinsprint); */

          /* ************************** */
          // brundown Chart by sprint

          this.chartOptions = {
            series: [
              {
                name: "ideal",
                data: this.idealLine // this.idealLine // [50, 45, 40, 35, 30, 25, 20, 15, 10, 5,0] // 

              },

              {
                name: "work",
                data: this.workedLine //this.workedLine // [49, 43, 41, 33, 20, 10, 10, 8, 5 ] 
              }

            ],
            chart: {
              // height: 'auto',
              //type: "line",

              toolbar: {
                export: {
                  csv: {
                    filename: "BurndownChart",
                    //headerCategory: 'Date;',
                    //columnDelimiter: ';',
                    headerCategory: 'Date',
                    //headerValue: 'value'

                  },
                  svg: {
                    filename: "BurndownChart",
                  },
                  png: {
                    filename: "BurndownChart",
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
              text: 'Burndown Chart',
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
              categories: this.dayinsprint, // this.dayinsprint,
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

          /* ************************** */

        },
          err => {
            this.msgError = err.error.message;
            Swal.fire('Hey!', this.msgError, 'warning');
            console.error(this.msgError);
          });

      this.updateTablesprint();

      this.daysNumberInSprint();
      this.idealLineForSprint();


    }
  }


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


  openPopup(id: number) {
    this.router.navigate([{ outlets: { addspPopup: ['addspcompleted', id] } }]);
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
    this.router.navigate([{ outlets: { addspPopup: null } }]);
    location.reload();
  }


}
