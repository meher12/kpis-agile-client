import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
//import xml2js from 'xml2js';  
declare const require;
const xml2js = require("xml2js");

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JacocoReportService } from 'src/app/services/jacoco-report.service';
import { JacocoReport } from 'src/app/models/jacoco.model';
import Swal from 'sweetalert2';

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
  selector: 'app-jacoco-parse',
  templateUrl: './jacoco-parse.component.html',
  styleUrls: ['./jacoco-parse.component.scss']
})
export class JacocoParseComponent implements OnChanges, OnInit {

  @ViewChild("cartradar") chart: ChartComponent;
  public chartOptions: Partial<any>;

  @Input() getfileName;
  @Input() savefiledb;

  @Output() reportnameChanged = new EventEmitter<string>();

  jacocoReports: JacocoReport[];
  jacocoReport: JacocoReport[];
  projectName;


  dataSave: Object[];
  dataHTML: any[]

  selected;
  nameselected;
  arrayProjectName: string[];

  booleanValue;

  projectJacocoverage;


  public xmlItems: any;
  constructor(private _http: HttpClient, private jacoreportService: JacocoReportService) { localStorage.clear(); /* this.loadXML(); */ }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.getfileName) {

      this._http.get('http://localhost:8081/api/files/' + this.getfileName,
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'text/xml')
            .append('Access-Control-Allow-Methods', 'GET')
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
          responseType: 'text'
        })
        .subscribe((data) => {
          this.parseXML(data).then((data) => {
            this.xmlItems = data;

            // localStorage.setItem("xmlContent", JSON.stringify(this.xmlItems));
            // this.retrievedObject = JSON.parse(localStorage.getItem("xmlContent"));
            this.dataHTML = this.xmlItems[0];
            this.projectName = this.xmlItems[1];
            this.reportnameChanged.emit(this.projectName);

            //dynamically build list of objects
            const myobj = { data: [] };
            for (let index = 0; index < this.xmlItems[0].length; index++) {
              myobj.data.push({ xmlData: this.xmlItems[0][index], id: this.xmlItems[1] })
            }

            var array = myobj.data
            var array2 = myobj.data
            this.dataSave = array.map(element => element.xmlData);


            var newArray2 = array2.map(element => element.id);
            for (var i = 0; i < this.dataSave.length; i++) {
              this.dataSave[i]['projectname'] = newArray2[0]
            }
            if (this.savefiledb.value) {
              //console.log("Input value"+this.savefiledb.value)
              this.jacoreportService.createReport(this.dataSave).subscribe(data => { console.log(data) })
            }

          },
            err => {
              var msgError = err.error.message;
              Swal.fire('Hey!', msgError, 'warning')
            }

          );

        });
    }

    this.getAllProjectName()
  }

  ngOnInit(): void {


  }

  getAllProjectName() {
    this.jacoreportService.getReportList()
      .subscribe({
        next: (data) => {
          this.jacocoReports = data;
          this.arrayProjectName = [...new Set(this.jacocoReports.map(elem => elem.projectname))];
          //console.log(this.arrayProjectName)
        }
      })
  }

  getreportByName(event: any) {
    this.nameselected = event.target.value;

    this.jacoreportService.gettotalCoverageByPName(this.nameselected)
      .subscribe(data => {
        this.projectJacocoverage = data;
        this.getRadarTatalcoverage(this.projectJacocoverage)
      }
      )

    // get arary data coverage
    this.jacoreportService.getReportListByPName(this.nameselected)
      .subscribe({
        next: (data) => {
          this.jacocoReport = data;
        }
      })
  }

  getRadarTatalcoverage(coverage: any) {
    this.chartOptions = {
      series: [coverage],
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
      labels: ["Coverage"]
    };
  }
  parseXML(data) {
    return new Promise(resolve => {
      var k: string | number,
        projectName: string,
        jacocoArray = [],
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      parser.parseString(data, function (err, result) {
        var obj = result.report;
        projectName = obj.$.name;

        /* for (var i = 0; i < obj.counter.length; i++) {
          console.log(obj.counter[i].$.type)
        } */

        for (k in obj.counter) {

          var item = obj.counter[k].$;

          var coveredNumber = Number(item.covered)
          var missedNumber = Number(item.missed)
          var sum = coveredNumber + missedNumber

          var percentageCalcul = (100 * coveredNumber) / sum

          jacocoArray.push({
            type: item.type,
            covered: item.covered,
            missed: item.missed,
            percentage: percentageCalcul.toFixed(2),

          });

        }
        resolve([jacocoArray, projectName]);
      });
    });
  }

  /* getdaa(){
    this.booleanValue = true;
   // get coverage total
   this.jacoreportService.gettotalCoverageByPName(this.nameselected)
   .subscribe(data => this.projectJacocoverage = data)

   // get arary data coverage
    this.jacoreportService.getReportListByPName( this.nameselected)
    .subscribe({
      next: (data) => {
        this.jacocoReport = data;
      }
    })
  } */
  /*  loadXML(fileName) {
     console.log('http://localhost:8081/api/files/'+this.getfileName)
     this._http.get('http://localhost:8081/api/files/'+this.getfileName,
       {
         headers: new HttpHeaders()
           .set('Content-Type', 'text/xml')
           .append('Access-Control-Allow-Methods', 'GET')
           .append('Access-Control-Allow-Origin', '*')
           .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
         responseType: 'text'
       })
       .subscribe((data) => {
         this.parseXML(data).then((data) => {
           this.xmlItems = data;
         });
   
       });
   } */






  /*   parseXML(data) {  
      return new Promise(resolve => {  
        var k: string | number,  
          arr = [],  
          parser = new xml2js.Parser(  
            {  
              trim: true,  
              explicitArray: true  
            });  
        parser.parseString(data, function (err, result) {  
          var obj = result.Employee;  
          for (k in obj.emp) {  
            var item = obj.emp[k];  
            arr.push({  
              id: item.id[0],  
              name: item.name[0],  
              gender: item.gender[0],  
              mobile: item.mobile[0]  
            });  
          }  
          resolve(arr);  
        });  
      });  
    }  
    */
}
