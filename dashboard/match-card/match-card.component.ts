import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-match-card',
  templateUrl: './match-card.component.html',
  styleUrls: ['./match-card.component.scss'],
})
export class MatchCardComponent implements OnInit {
  @Input() cssClass: string = '';
  @Input() description: string = '';
  @Input() total: string = '';
  @Input() today: string = '';
  @Input() upcoming: string = '';
  @Input() completed: string = '';
  @Input() color: string = '';
  @Input() img: string = '';
  constructor() {}

  ngOnInit(): void {}
}
