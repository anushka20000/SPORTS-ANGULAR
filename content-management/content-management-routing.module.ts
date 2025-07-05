import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {CoursesComponent} from "./courses/courses.component";
import {ShortsComponent} from "./shorts/shorts.component";
import {ContactComponent} from "./contact/contact.component";
import {TermsComponent} from "./terms/terms.component";
import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";
import {PagesComponent} from "./pages/pages.component";
import { ItemComponent } from './item/item.component';
import { NotifyComponent } from './push-notification/notify.component';

const routes: Routes = [{
  path: '',
  children: [
    {path:"home",component:HomeComponent},
    {path:"courses",component:CoursesComponent},
    {path:"shorts",component:ShortsComponent},
    {path:"contact",component:ContactComponent},
    {path:"terms",component:TermsComponent},
    {path:"pages",component:PagesComponent},
    {path:"privacy",component:PrivacyPolicyComponent},
    {path:"push-notifications",component: NotifyComponent},

    {
         path:'home/items/:id/:type',
         component: ItemComponent,
   },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
  ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentManagementRoutingModule { }
