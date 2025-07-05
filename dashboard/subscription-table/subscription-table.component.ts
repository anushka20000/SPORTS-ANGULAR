import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscription-table',
  templateUrl: './subscription-table.component.html',
})
export class SubscriptionTableComponent implements OnInit {
  constructor() {}
  @Input() total_paid: any = 0;
  @Input() total_unpaid: any = 0;
  @Input() paid_razorpay: any = 0;
  @Input() all_content_paid: any = 0;
  @Input() tournament_paid: any = 0;
  @Input() match_paid: any = 0;
  @Input() paid_apple: any = 0;


  ngOnInit(): void {}
}
