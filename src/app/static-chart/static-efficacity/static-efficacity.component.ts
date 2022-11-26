import { Component, OnInit, ViewChild } from '@angular/core';


import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  yaxis: ApexYAxis;
};


@Component({
  selector: 'app-static-efficacity',
  templateUrl: './static-efficacity.component.html',
  styleUrls: ['./static-efficacity.component.scss']
})
export class StaticEfficacityComponent implements OnInit {

  @ViewChild("efficacityChart") chart: ChartComponent;
  public chartOptions: Partial<any>;

  constructor() { }

  ngOnInit(): void {
    this.efficacityChart()
  }



  efficacityChart(){
    this.chartOptions = {
      series: [
        {
          name: "Efficiency",
          data: ['20','50','65','35']
        }
      ],
      chart: {
        height: 'auto',
        type: "line",
        toolbar: {
          show:false,
        }
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: 'Efficiency Chart',
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
        }
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: ['07-01-2022', '08-01-2022', '09-01-2022', '10-01-2022'], 
        
      },
      yaxis: {
        title: {
          text: "Efficiency",
          style: {
            colors: [],
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
    };
  }

}
