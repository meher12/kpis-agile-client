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
  selector: 'app-current-sp-in-project-chart',
  templateUrl: './current-sp-in-project-chart.component.html',
  styleUrls: ['./current-sp-in-project-chart.component.scss']
})
export class CurrentSpInProjectChartComponent implements OnChanges, OnInit {

  @ViewChild("chartProgressSp") chart: ChartComponent;
  public chartOptions: Partial<any>;

  @Input() progressSptotal;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.progressSptotal){
    //console.log("SPCCD"+ this.progressSptotal)
    this.progressChartSpCompleted(this.progressSptotal);
    }
  }

  
  progressChartSpCompleted(progressCompleted: any){
    this.chartOptions = {
      series: [progressCompleted],
      chart: {
        height: 350,
        type: "radialBar",
        offsetY: -10,
        toolbar: {
          show: true
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          dataLabels: {
            name: {
              fontSize: "16px",
              color: undefined,
              offsetY: 40
            },
            value: {
              offsetY: 0,
              fontSize: "22px",
              color: 'red',
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
          type: "verticle",
          shadeIntensity: 0.15,
          inverseColors: true,
          gradientToColors: ["#FF6258", "#FFBC00"],
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 100],
          colorStops: [
            [
              {
                offset: 0,
                color: "#FF6258",
                opacity: 1
              },
              {
                offset: 51,
                color: "#FFBC00",
                opacity: 50
              },
              {
                offset: 100,
                color: "#77C579",
                opacity: 1
              }
            ]
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
        dashArray: 0,
        colors: ["grey"]
      },
      labels: ["Story point completed"]
    };
   /*  this.chartOptions = {
      series: [progressCompleted],
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
              color: "#8A0808",
              opacity: 1
            },
            {
              offset: 20,
              color: "#FE2E2E",
              opacity: 1
            },
            {
              offset: 60,
              color: "#FFBF00",
              opacity: 1
            },
            {
              offset: 100,
              color: "#74DF00",
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
