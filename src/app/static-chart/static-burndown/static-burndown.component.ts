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

@Component({
  selector: 'app-static-burndown',
  templateUrl: './static-burndown.component.html',
  styleUrls: ['./static-burndown.component.scss']
})
export class StaticBurndownComponent implements OnInit {

  @ViewChild("brundownChart") chart: ChartComponent;
  public chartOptions: Partial<any>;

  constructor() { }

  ngOnInit(): void {
    this.burnDownChart()
  }

  // burndown Chart by sprint
  burnDownChart() {

  this.chartOptions = {
    series: [
      {
        name: "ideal",
        data: [50, 45, 40, 35, 30, 25, 20, 15, 10, 5] 
      },

      {
        name: "work",
        data: [49, 43, 41, 33, 20, 10, 10, 8, 5]
      }

    ],
    chart: {
     height: '400px',
      type: "line",
     
      toolbar: {
        show: false,
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
      categories: ['01-01-2022', '02-01-2022', '03-01-2022', '04-01-2022', '05-01-2022', '06-01-2022', '07-01-2022', '08-01-2022', '09-01-2022', '10-01-2022']
      ,
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


}
