import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.scss'],
})
export class VideoCardComponent implements OnInit {
  @Input() cssClass: string = '';
  @Input() description: string = '';
  @Input() total: string = '';
  @Input() total_views: string = '';
  @Input() unique_views: string = '';

  @Input() color: string = '';
  @Input() img: string = '';
  constructor() {}

  ngOnInit(): void {}
}
