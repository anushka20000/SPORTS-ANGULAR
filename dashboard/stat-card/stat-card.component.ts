import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
})
export class StatCardComponent implements OnInit {
  @Input() cssClass: string = '';
  @Input() description: string = '';
  @Input() total: number = 0;
  @Input() logged_in: number = 0;
  @Input() registered: any = 0 ;
  @Input() color: string = '';
  @Input() img: string = '';
  constructor() {}

  ngOnInit(): void {
    console.log(this.registered)
  }
}
