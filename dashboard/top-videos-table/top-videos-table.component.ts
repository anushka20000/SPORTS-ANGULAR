import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'top-videos-table',
  templateUrl: './top-videos-table.component.html',
})
export class TopVideosTableComponent implements OnInit {
  constructor() {}
    @Input() data: any = [];

  ngOnInit(): void {}
}
