import { Component, OnInit, ViewChild } from '@angular/core';


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
  selector: 'app-static-release',
  templateUrl: './static-release.component.html',
  styleUrls: ['./static-release.component.scss']
})
export class StaticReleaseComponent implements OnInit {

  @ViewChild("releaseBurndown") chart: ChartComponent;

  public chartOptions: Partial<any>;

  constructor() { }

  ngOnInit(): void {
    this.relaseBrundounChart();
  }

  relaseBrundounChart() {

    // sprintname.push("Remaining story points");
   
 
     /* Start Chart*/
     this.chartOptions = {
       series: [
         {
           name: "Remaining",
           data: [85, 61, 40, 33, 0] //[85, 61, 40, 18, 10]
         },
         {
           name: "Done",
           data:  [24, 21, 22, 33]  //[24, 21, 22, 18]
         },
         {
           name: "New",
           data:  [0, 0, 15, 0] //[0, 0, 10, 0]
         }
       ],
       chart: {
         
         type: "bar",
         height: '400px',
         stacked: true,
         toolbar: {
          show: false,
        }
       
       },
       title: {
         text: 'Release burndown Chart',
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
         categories: ['Sprint 1', 'Sprint 3', 'Sprint 4','Next sprint'],
         tickPlacement: 'on',
         labels: {
           rotate: -25,
           rotateAlways: true,
            /* minHeight: 150,
            maxHeight: 450,   */
           style: {
             colors: [],
             fontSize: '12px',
             fontFamily: 'Helvetica, Arial, sans-serif',
             fontWeight: 'bold',
             cssClass: 'apexcharts-xaxis-label',
           }
         }
       },
       
       stroke: {
         show: true,
         width: 2,
         colors: ["transparent"]
       },
       /*  yaxis: {
          show: true,
          showAlways: true,
          title: {
            text: "Story points",
            style: {
              colors: [],
              fontSize: '10px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 'bold',
              cssClass: 'apexcharts-xaxis-label',
            }
          },
          labels: {
            show: true,
            style: {
              colors: [],
              fontSize: '10px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 'bold',
              cssClass: 'apexcharts-xaxis-label',
            }
          }
  
        }, */
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
