import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ManageStudentsComponent} from "./manage-students/manage-students.component";
import {FreeStudentsComponent} from "./free-students/free-students.component";
import {SubscribedStudentsComponent} from "./subscribed-students/subscribed-students.component";
import {SubscriptionRequestsComponent} from "./subscription-requests/subscription-requests.component";
import {SubscriptionExpiredStudentsComponent} from "./subscription-expired-students/subscription-expired-students.component";
import {SubscriptionExpiringStudentsComponent} from "./subscription-expiring-students/subscription-expiring-students.component";
import { ChangePasswordComponent } from 'src/app/modules/student/change-password/change-password.component';
import { TransactionComponent } from './transactions/transaction.component';

const routes: Routes = [{
  path: '',
  children: [
    {path:"users",component:ManageStudentsComponent},
    {path:"change-password",component: ChangePasswordComponent},
    {path:"free-students",component:FreeStudentsComponent},

    {path:"subscribed-users",component:SubscribedStudentsComponent},
    {path:"transactions",component:TransactionComponent},

    {path:"subscription-requests",component:SubscriptionRequestsComponent},
    {path:"subscription-expired-students",component:SubscriptionExpiredStudentsComponent},
    {path:"subscription-expiring-students",component:SubscriptionExpiringStudentsComponent},
    { path: '', redirectTo: 'students', pathMatch: 'full' },
    { path: '**', redirectTo: 'students', pathMatch: 'full' },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionManagementRoutingModule { }
