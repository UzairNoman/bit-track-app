import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.scss']
})
export class SearchDetailComponent implements OnInit {
  public searchedObj: any;
  constructor(public dataService: DataService) {
    this.searchedObj = this.dataService.searchedSubj;
    this.searchedObj.reddit_avatar =  this.searchedObj.reddit_avatar.split("?")[0]


   }

  ngOnInit(): void {
    console.log(this.searchedObj)
  }

}
