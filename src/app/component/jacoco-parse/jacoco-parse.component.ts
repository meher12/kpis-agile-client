import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
//import xml2js from 'xml2js';  
declare const require;
const xml2js = require("xml2js");

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JacocoReportService } from 'src/app/services/jacoco-report.service';
import { JacocoReport } from 'src/app/models/jacoco.model';

@Component({
  selector: 'app-jacoco-parse',
  templateUrl: './jacoco-parse.component.html',
  styleUrls: ['./jacoco-parse.component.scss']
})
export class JacocoParseComponent implements OnChanges, OnInit {

  @Input() getfileName;

  jacocoReports: JacocoReport[];
  jacocoReport: JacocoReport[];
  projectName;


  dataSave: Object[];
  dataHTML: any[]

  selected;
  nameselected;
  arrayProjectName: string[];


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
            //console.log((this.retrievedObject));

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
            this.jacoreportService.createReport(this.dataSave).subscribe(data => { console.log(data) })

          });

        });
    }
  }

  ngOnInit(): void {
    this.getAllProjectName()

  }

  getAllProjectName() {
    this.jacoreportService.getReportList()
      .subscribe({
        next: (data) => {
          this.jacocoReports = data;
          this.arrayProjectName = [...new Set(this.jacocoReports.map(elem => elem.projectname))];
          console.log(this.arrayProjectName)
        }
      })
  }

  getreportByName(event: any) {
    this.nameselected = event.target.value;
    this.jacoreportService.getReportListByPName(event.target.value)
      .subscribe({
        next: (data) => {
          this.jacocoReport = data;

        }
      })
  }
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
