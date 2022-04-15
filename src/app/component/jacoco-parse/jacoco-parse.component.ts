import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
//import xml2js from 'xml2js';  
declare const require;
const xml2js = require("xml2js");

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-jacoco-parse',
  templateUrl: './jacoco-parse.component.html',
  styleUrls: ['./jacoco-parse.component.scss']
})
export class JacocoParseComponent implements OnChanges, OnInit {

  @Input() getfileName;

  projectName;
  dataArray: any[];
  retrievedObject;

  public xmlItems: any;
  constructor(private _http: HttpClient) { localStorage.clear(); /* this.loadXML(); */ }

  ngOnChanges(changes: SimpleChanges): void {

    localStorage.setItem("filename", this.getfileName)
    var localstoragefileName = localStorage.getItem("filename");


    if (this.getfileName) {
      //console.log("----fffff--", );
      //this. loadXML(this.getfileName);

      // console.log('http://localhost:8081/api/files/'+this.getfileName)
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
            this.dataArray = this.xmlItems[0];
            this.projectName = this.xmlItems[1];
            //console.log((this.retrievedObject));
          });

        });
    }
  }

  ngOnInit(): void { }

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
        percentageArray = [],

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

          var percentage = (100 * coveredNumber) / sum
          percentageArray.push({ percentage });

          jacocoArray.push({
            type: item.type,
            covered: item.covered,
            missed: item.missed,
            percentage: percentage.toFixed(2) + "%",

          });
        }

        // sum percentage coverage
        /*   var collectPrecentage = Object.keys(percentageArray);
          let totalPercentage
          for (var i= 0; i < collectPrecentage.length; i++) {
   
            totalPercentage = percentageArray[collectPrecentage[i]];
            //console.log(percentageArray[collectPrecentage[i]]);
          } */

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
