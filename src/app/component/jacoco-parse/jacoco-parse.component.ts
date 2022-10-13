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
  @Input() getprojectRefer;
  @Input() listNameReport;

  @Output() reportnameChanged = new EventEmitter<string>();

  jacocoReports: JacocoReport[];
  jacocoReport: JacocoReport[];
  projectName;
  projectRef: String;
  msgError = "";

  dataSave: Object[];
  dataHTML: any[]

  selected;
  selectedOne;
  nameselected;
  arrayProjectName: string[];


  projectJacocoverage;


  public xmlItems: any;
  constructor(private _http: HttpClient, private jacoreportService: JacocoReportService) { localStorage.clear(); }

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
            this.projectRef = this.xmlItems[2];
            this.reportnameChanged.emit(this.projectName);

            //dynamically build list of objects
            const myobj = { data: [] };
            for (let index = 0; index < this.xmlItems[0].length; index++) {
              myobj.data.push({ xmlData: this.xmlItems[0][index], id: this.xmlItems[1], projRef: this.xmlItems[2] })
            }

            var array = myobj.data
            var array2 = myobj.data
            var array3 = myobj.data

            this.dataSave = array.map(element => element.xmlData);

            var newArray2 = array2.map(element => element.id);
            var newArray3 = array3.map(element => element.projRef);


            for (var i = 0; i < this.dataSave.length; i++) {
              this.dataSave[i]['projectname'] = newArray2[0];


            }
            newArray3[0] = this.getprojectRefer;
            for (var i = 0; i < this.dataSave.length; i++) {
              this.dataSave[i]['projectRef'] = newArray3[0]
              //console.log("Project ID ---------"+ this.dataSave[i]['projectRef']);

            }


            if (this.savefiledb.value) {

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
    // get project report for select option to choose report
    /* 
    ************* ngOnChanges best practice - always use SimpleChanges - always *************

    This code now has a problem. OnChanges gets called twice - once for every @Input. What if the first time it's called is for mySecondInputParameter? Well,
    we'd be calling doSomething with 'undefined' since myFirstInputParameter hasn't been set yet. The way I typically see this handled is like this...
    OnChanges() {
    if (this.myFirstInputParameter) {
      this.getAllProjectName(this.myFirstInputParameter);
    }
      }
    And this is the anti-pattern. Or worse, it's just plain wrong. Consider what happens if the first value to be set happens to be myFirstInputParameter. 
    Well, our OnChanges fires, finds myFirstInputParameter is set and calls doSomething(). Then OnChanges fires again because mySecondInputParameter is set, finds that myFirstInputParameter is set and calls doSomething() again. This was not intended by the developer. If further @Input()'s are added, then doSomething() gets called even more. Does the angular developer really control the order that ngOnChanges() is called for each @Input? I'd say not. So writing code that assumes a particular order is bad. In fact, depending on your app, the order of calls to OnChanges may not be consistent and then your app may act inconsistently with race conditions.

    The solution is to use SimpleChanges. And further to that - to ALWAYS use SimpleChanges. Lets see how SimpleChanges actually works. It's quite a simple change ;-)


    This looks a bit verbose but it fixes our problem. ngOnChanges still gets called multiple times,
     but crucially the changes parameter tells us which @Input() caused the call. SimpleChanges also happens to provide the old value of the 
     @Input() if there has been multiple changes to that value - pretty handy.
    I propose that we should always take the SimpleChanges parameter in our ngOnChanges methods. Even if we only have a single @Input() on our component. 
    I don't want code that assumes there will always be only one @Input(). 
    That would be forcing the next developer to handle my @Input() if they want to add their own.
     It would be so easy to introduce a bug by adding another @Input() to a component and forgetting to check ngOnChanges() for the handling of the other @Input()'s. 
    So take responsibility of your @Input() and embrace SimpleChanges.
    
    Here get only the current value changed ;)
    https://dev.to/nickraphael/ngonchanges-best-practice-always-use-simplechanges-always-1feg#
    */
    /* for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'listNameReport': {
            this.getAllProjectName(changes.currentValue)
          }
        }
      }
    } */

   //  https://generic-ui.com/blog/how-to-make-angular-onChanges-better
    // Here get only not undefined and  current value changed ;)
    if (changes.listNameReport !== undefined && changes.listNameReport.currentValue !== undefined) {
      this.getAllProjectName(changes.currentValue)
    }

  }

  ngOnInit(): void {

  }

  // get list of project saved in jacoco coverage table
  getAllProjectName(listNameReport: any) {
    if (Array.isArray(this.listNameReport) && this.listNameReport.length) {
      this.arrayProjectName = this.listNameReport;
      //console.log("List Project Name: " + this.arrayProjectName)
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There is no report for this project ! Import one',
      })

      this.arrayProjectName = [];
    }


  }


  // get report by name
  getreportByName(event: any) {
    this.nameselected = event.target.value;
    this.jacoreportService.gettotalCoverageByPName(this.nameselected)
      .subscribe(data => {
        this.projectJacocoverage = data;
        this.getRadarTotalcoverage(this.projectJacocoverage)
      }
      )

    // get arary data coverage
    this.jacoreportService.getReportListByPName(this.nameselected)
      .subscribe({
        next: (data) => {
          this.jacocoReport = data;
          console.log("Report is:"+ this.jacocoReport);
        }
      })
  }




  //deletReportByName from table jcoverage
  deletReportByName(reportName: string) {
    /*  this.jacoreportService.deletereportByReportName(reportName)
     .subscribe( data => console.log(data)); */

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Deleted!',
          'Report has been deleted.',
          'success'
        ),

          this.jacoreportService.deletereportByReportName(reportName)
            .subscribe(data => {
              console.log(data);
              setTimeout(function () {
                if (!localStorage.getItem('reprot')) {
                  localStorage.setItem('reprot', 'no reload')
                  location.reload()
                } else {
                  localStorage.removeItem('reprot')
                }
              }, 2000);

            },
              err => {
                this.msgError = err.error.message;
                Swal.fire('Hey!', this.msgError, 'warning')
                console.error(this.msgError);
              })

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary sprints is safe :)',
          'error'
        )
      }
    })



  }

  getRadarTotalcoverage(coverage: any) {
    //console.log("---", coverage)
    this.chartOptions = {
      //series: [(coverage).replace(',', '.')],
      series: [(coverage).toFixed(2)],
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
                return val + " %";
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
        projectRef: string,
        jacocoArray = [],
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      parser.parseString(data, function (err, result) {
        var obj = result.report;
        projectName = obj.$.name;

        projectRef = "";

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
        resolve([jacocoArray, projectName, projectRef]);
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