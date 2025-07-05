import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentManagementRoutingModule } from './content-management-routing.module';
import { HomeComponent } from './home/home.component';
import { CoursesComponent } from './courses/courses.component';
import { ShortsComponent } from './shorts/shorts.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ContactComponent } from './contact/contact.component';
import {ModalModule} from "../../modules/modal/modal.module";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {InlineSVGModule} from "ng-inline-svg-2";
import {WidgetsModule} from "../../modules/widgets/widgets.module";
import {DragulaModule} from "ng2-dragula";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {PagesComponent} from "./pages/pages.component";
import {DataTablesModule} from "angular-datatables";
import {EditPageComponent} from "./edit-page/edit-page.component";
import {NgxDropzoneModule} from "ngx-dropzone";
import {EditorModule} from "@tinymce/tinymce-angular";
import { AddItemComponent } from './add-item/add-item.component';
import { ItemComponent } from './item/item.component';
import { AddHomeItemComponent } from './add-home-item/add-home-item.component';
import { EditHomeItemComponent } from './edit-home-item/edit-home-item.component';
import { NotifyComponent } from './push-notification/notify.component';



@NgModule({
  declarations: [
    HomeComponent,
    CoursesComponent,
    ShortsComponent,
    TermsComponent,
    PrivacyPolicyComponent,
    ContactComponent,
    PagesComponent,
    EditPageComponent,
    AddItemComponent,
    ItemComponent,
    AddHomeItemComponent,
    EditHomeItemComponent,
    NotifyComponent
  ],
  imports: [
    CommonModule,
    ContentManagementRoutingModule,
    ModalModule,
    NgbModalModule,
    InlineSVGModule,
    WidgetsModule,
    DragulaModule,
    FormsModule,
    NgSelectModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    DataTablesModule,
    EditorModule
  ]
})
export class ContentManagementModule { }
