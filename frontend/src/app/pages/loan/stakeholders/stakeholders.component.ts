import { Component, OnInit } from '@angular/core';
import { Loan } from '../loan';

@Component({
  selector: 'app-stakeholders',
  templateUrl: './stakeholders.component.html',
  styleUrls: ['./stakeholders.component.css']
})
export class StakeholdersComponent implements OnInit {
  tabActive = "funders";
  openBorrowerModal = false;
  
  constructor() { }

  ngOnInit(): void {
  }

  onSave(loan: Loan | null){
    this.openBorrowerModal = false;
  }

  onOpenCreate(){
    this.openBorrowerModal = true;
  }

}
