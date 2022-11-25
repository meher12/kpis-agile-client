import { Component, OnInit, ViewChild } from '@angular/core';


import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  // series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};


@Component({
  selector: 'app-static-velocity',
  templateUrl: './static-velocity.component.html',
  styleUrls: ['./static-velocity.component.scss']
})
export class StaticVelocityComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<any>;

  constructor() { }

  ngOnInit(): void {
    this.velocityChart();
  }

  // velocity chart:
velocityChart() {

  this.chartOptions = {
    series: [
      {
        name: "Remaining",
        data: [40,25,45,30]
      },
      {
        name: "Done",
        data: [35,25,43,29]
      }
    ],
    chart: {
      type: "bar",
      height: "350px",
      toolbar: {
        show: false,
      }

    },
    title: {
      text: 'Velocity Chart',
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
      bar: {
        horizontal: false,
        columnWidth: "55%",
        /* borderRadius: 10 */
      }
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"]
    },
    xaxis: {
      type: "category",
      categories: ["Sprint 1","Sprint 2","Sprint 3","Sprint 4"],
      tickPlacement: 'on',
      labels: {
        rotate: -10,
        rotateAlways: true,
        style: {
          colors: [],
          fontSize: '12px',
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
          colors: [],
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 'bold',
          cssClass: 'apexcharts-xaxis-label',
        }
      },
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
    legend: {
      position: "right",
      offsetY: 40
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "" + val + " Story points";
        }
      }
    },
   
  };
}


}
