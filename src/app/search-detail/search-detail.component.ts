import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import * as _ from 'underscore';
@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.scss']
})
export class SearchDetailComponent implements OnInit {
  public searchedObj: any;
  parsedArr: any = [];
  userTransaction: any = [];
  constructor(public dataService: DataService, public http: HttpClient) {
    this.searchedObj = this.dataService.searchedSubj;
    this.searchedObj.reddit_avatar =  this.searchedObj.reddit_avatar.split("?")[0]
    this.http.get("assets/final_info_transactions.jsonl", {responseType: 'text'}).subscribe(transaction =>{
      let tArray = transaction.split("\r\n");
      tArray.forEach((element) => {
        if(element){
          this.parsedArr.push(JSON.parse(element.replace(/NaN/g, '""')));
        }
      });
      this.userTransaction = _.find(this.parsedArr, (item) => {
        return item["address"] == this.searchedObj.address; 
      })
      console.log(this.userTransaction)
      
    });
    


   }

  ngOnInit(): void {
    console.log(this.searchedObj)
  }

}
