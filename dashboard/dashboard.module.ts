import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { WidgetsModule } from '../../_metronic/partials';
import {StatCardComponent} from "./stat-card/stat-card.component";
import {SubCardComponent} from "./sub-card/sub-card.component";
import {MatchCardComponent} from "./match-card/match-card.component";
import {VideoCardComponent} from "./video-card/video-card.component";
import {SubscriptionTableComponent} from "./subscription-table/subscription-table.component";
import {InlineSVGModule} from "ng-inline-svg-2";
import {TopMatchesTableComponent} from "./top-matches-table/top-matches-table.component";
import {TopVideosTableComponent} from "./top-videos-table/top-videos-table.component";


@NgModule({
  declarations: [DashboardComponent, StatCardComponent,SubCardComponent,MatchCardComponent,VideoCardComponent,
    SubscriptionTableComponent,TopMatchesTableComponent,TopVideosTableComponent],
  imports: [
    CommonModule,
    InlineSVGModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),

    //ModalsModule,
    WidgetsModule,

  ],
})

export class DashboardModule {
   
}
