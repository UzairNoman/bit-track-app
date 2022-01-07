import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import * as _ from 'underscore';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public userArray = [];
  constructor(public http: HttpClient,private papa: Papa) { }

  ngOnInit(): void {
  }
  search(event){
    let addr = event.target.value
    this.readFile();
  }
  readFile(){
    this.http.get('assets/twitter_data_append.csv', {responseType: 'text'})
    .subscribe(
        data => {
          console.log('now: ', _.now());
          let csvObj = JSON.parse(this.CSVToJSON(data));
          csvObj.pop()
          console.log(csvObj)
          console.log(_.find(csvObj, function(item) {
            return item["address"] == '0x5A02d339375b755Cd52823E199034e6921cBF33F'; 
          }));
        },
        error => {
            console.log(error);
        }
    );
  }
  CSVToJSON(csvData) {
    var data = this.CSVToArray(csvData,",");
    var objData = [];
    for (var i = 1; i < data.length; i++) {
        objData[i - 1] = {};
        for (var k = 0; k < data[0].length && k < data[i].length; k++) {
            var key = data[0][k];
            objData[i - 1][key] = data[i][k]
        }
    }
    var jsonData = JSON.stringify(objData);
    jsonData = jsonData.replace(/},/g, "},\r\n");
    return jsonData;
}
CSVToArray(csvData, delimiter) {
  delimiter = (delimiter || ",");
   var pattern = new RegExp((
  "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
  "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
  "([^\"\\" + delimiter + "\\r\\n]*))"), "gi");
  var data = [[]];
  var matches = null;
  while (matches = pattern.exec(csvData)) {
      var matchedDelimiter = matches[1];
      if (matchedDelimiter.length && (matchedDelimiter != delimiter)) {
          data.push([]);
      }
      if (matches[2]) {
          var matchedDelimiter = matches[2].replace(
          new RegExp("\"\"", "g"), "\"");
      } else {
          var matchedDelimiter = matches[3];
      }
      data[data.length - 1].push(matchedDelimiter);
  }
  return (data);
}
}
