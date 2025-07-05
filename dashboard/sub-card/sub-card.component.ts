import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-card',
  templateUrl: './sub-card.component.html',
  styleUrls: ['./sub-card.component.scss'],
})
export class SubCardComponent implements OnInit {
  @Input() cssClass: string = '';
  @Input() description: string = '';
  @Input() total: any = 0;
  @Input() paid_razor: string = '';
  @Input() paid_apple: string = '';
  @Input() paid_admin: any ;
  @Input() color: string = '';
  @Input() img: string = '';
  constructor() {}

  ngOnInit(): void {}
}
