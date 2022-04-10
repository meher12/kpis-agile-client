import { Component, Input, OnChanges, OnInit, ViewChild, SimpleChanges } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  colors: string[];
};


@Component({
  selector: 'app-commitment-sp-in-project-chart',
  templateUrl: './commitment-sp-in-project-chart.component.html',
  styleUrls: ['./commitment-sp-in-project-chart.component.scss']
})
export class CommitmentSpInProjectChartComponent implements OnChanges, OnInit {

  @ViewChild("chartProgressCommitmentSp") chart: ChartComponent;
  public chartOptions: Partial<any>;

  @Input() progressSptotal;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.progressSptotal) {
       //console.log("CCCCCC"+this.progressSptotal.totalspcompleted)
       //console.log("rrrrr"+this.progressSptotal.totalstorypointsinitiallycounts)
      this.progressChartSpCommitment(this.progressSptotal.totalspcompleted, this.progressSptotal.totalstorypointsinitiallycounts)
    }
  }



  progressChartSpCommitment(progressCompleted: any, totalinitialzed: any) {

    this.chartOptions = {
      series: [
        {
          name: "Realized",
          data: [
            {
              x: "Story Points",
              y: progressCompleted,
              goals: [
                {
                  name: "Planned",
                  value: totalinitialzed,
                  strokeWidth: 50,
                  strokeHeight: 15,
                  strokeColor: "#0868F1"
                }
              ]
            },
          ]
        }
      ],
      chart: {
        height: 'auto',
        type: "bar",
      },
     
      plotOptions: {
        bar: {
          columnWidth: "10"
        }
      },
      colors: ["#19D44E"],
      dataLabels: {
        enabled: true,
        
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        fontFamily: 'Poppins',
        fontWeight: 600,
        customLegendItems: ["Realized", "Planned"],
        markers: {
          fillColors: ["#19D44E", "#0868F1"]
        }
      }
    };

  /*   this.chartOptions = {
      series: [44, 30],
      chart: {
        width: 380,
        type: "donut"
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          offsetY: 10
        }
      },
      grid: {
        padding: {
          bottom: -80
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    }; */
 /*    this.chartOptions = {
      series: [progressComitment],
      chart: {
        height: 'auto',
        type: "radialBar",
        offsetY: -10


      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          dataLabels: {
            name: {
              fontSize: "16px",
              color: "#228B22",
              fontWeight: 'bold',
              offsetY: 40,

            },
            value: {
              offsetY: 0,
              fontSize: "16px",
              color: 'red',
              fontWeight: 'bold',
              formatter: function (val) {
                return val + "%";
              }
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          colorStops: [
            {
              offset: 0,
              color: "#74DF00",

              opacity: 1
            },
            {
              offset: 60,
              color: "#FFBF00",
              opacity: 1
            },
            {
              offset: 70,
              color: "#FE2E2E",
              opacity: 1
            },
            {
              offset: 100,
              color: "#8A0808",
              opacity: 1
            }
          ]
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },

          }
        }
      ],
      stroke: {
        dashArray: 5
      },
      labels: ["Progress"]
    }; */
  }
}