import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stakeholders',
  templateUrl: './stakeholders.component.html',
  styleUrls: ['./stakeholders.component.css']
})
export class StakeholdersComponent implements OnInit {
  tabActive = "funders"
  
  constructor() { }

  ngOnInit(): void {
  }

}
