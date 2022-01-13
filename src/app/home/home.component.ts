import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Papa } from 'ngx-papaparse';
import * as _ from 'underscore';
import { DataService } from '../data.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public userArray = [];
  public searchTerm;
  public count = 0;
  public total = 0;
  sortByBal: any[];
  constructor(public http: HttpClient,private papa: Papa, public router: Router,public dataService: DataService) { }

  ngOnInit(): void {
    this.readFile(this.searchTerm);
    
  }
  search(event){
    console.log(this.searchTerm);
    let searchedRow = _.find(this.userArray, function(item) {
      return item["address"] == this.searchTerm; 
    })
    this.dataService.searchedSubj = searchedRow;
    this.router.navigate(["search"]);
  }
  readFile(addr){
    this.http.get('assets/final_info.csv', {responseType: 'text'})
    .subscribe(
        data => {
          let csvObj = JSON.parse(this.CSVToJSON(data));
          csvObj.pop()
          this.userArray = csvObj;
          this.sortByBal = _.sortBy(this.userArray,function(avatar) {
            return -avatar.balance
          });
        console.log(this.sortByBal)
        _.forEach(csvObj, (elem) =>{
          this.total += 1
          if(elem["twitter_username"] != ""){
            this.count +=1
          }
        });
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
