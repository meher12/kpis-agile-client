import { Component, Input, OnChanges, OnInit, ViewChild, SimpleChanges } from '@angular/core';

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent,
  ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
};


@Component({
  selector: 'app-commitment-sp-in-project-chart',
  templateUrl: './commitment-sp-in-project-chart.component.html',
  styleUrls: ['./commitment-sp-in-project-chart.component.scss']
})
export class CommitmentSpInProjectChartComponent implements OnChanges, OnInit {

  @ViewChild("chartProgressCommitmentSp") chart: ChartComponent;
  public chartOptions: Partial<any>;

  @Input() progressCommitmentSptotal;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.progressCommitmentSptotal) {
      // console.log("CCCCCC"+this.progressCommitmentSptotal)
      this.progressChartSpCommitment(this.progressCommitmentSptotal)
    }
  }



  progressChartSpCommitment(progressComitment: any) {
    this.chartOptions = {
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
    };
  }
}