import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionManagementRoutingModule } from './subscription-management-routing.module';
import {FreeStudentsComponent} from "./free-students/free-students.component";
import {ManageStudentsComponent} from "./manage-students/manage-students.component";
import {SubscribedStudentsComponent} from "./subscribed-students/subscribed-students.component";
import {SubscriptionExpiredStudentsComponent} from "./subscription-expired-students/subscription-expired-students.component";
import {SubscriptionRequestsComponent} from "./subscription-requests/subscription-requests.component";
import { SubscriptionExpiringStudentsComponent } from './subscription-expiring-students/subscription-expiring-students.component';
import {DataTablesModule} from "angular-datatables";
import {AddStudentComponent} from "../../modules/student/add-student/add-student.component";
import {InlineSVGModule} from "ng-inline-svg-2";
import {EditStudentComponent} from "../../modules/student/edit-student/edit-student.component";
import {ChangePasswordComponent} from "../../modules/student/change-password/change-password.component";
import {OrderHistoryComponent} from "../../modules/student/order-history/order-history.component";
import {ApplyPlanComponent} from "../../modules/student/apply-plan/apply-plan.component";
import {StudentListComponent} from "../../modules/student/student-list/student-list.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {OpenSubscriptionRequestComponent} from "./open-subscription_request/open-subscription-request.component";
import {AddSubscriptionRequestComponent} from "./add-subscription_request/add-subscription-request.component";
import {ModalModule} from "../../modules/modal/modal.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {ProcessSubscriptionRequestComponent} from "./process-subscription_request/process-subscription-request.component";
import {NgbDatepickerModule} from "@ng-bootstrap/ng-bootstrap";
import { TransactionComponent } from './transactions/transaction.component';



@NgModule({
  declarations: [
    FreeStudentsComponent,
    ManageStudentsComponent,
    SubscribedStudentsComponent,
    SubscriptionExpiredStudentsComponent,
    SubscriptionRequestsComponent,
    SubscriptionExpiringStudentsComponent,
    StudentListComponent,
    AddStudentComponent,
    EditStudentComponent,
    ChangePasswordComponent,
    OrderHistoryComponent,
    ApplyPlanComponent,
    OpenSubscriptionRequestComponent,
    AddSubscriptionRequestComponent,
    ProcessSubscriptionRequestComponent,
    TransactionComponent

  ],
  exports: [
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    SubscriptionManagementRoutingModule,
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    NgSelectModule,
    NgbDatepickerModule,
  ]
})
export class SubscriptionManagementModule { }
