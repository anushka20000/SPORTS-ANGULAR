import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {first} from "rxjs/operators";
import {SubscriptionService} from "../../../services/subscription.service";
import {ToastrService} from "ngx-toastr";
import {ClubService} from "../../../services/club.service";
import Swal from 'sweetalert2';
import { LeagueService } from 'src/app/services/league.service';
@Component({
  selector: 'app-league-standing',
  templateUrl: './league-standing.component.html',
})
export class LeagueStandingComponent implements OnInit, OnDestroy {
  _id=0;
  get id(): number {
    return this._id;
  }
  @Input() set id(value: number) {
    this._id = value;
    if(value>0)
    {
      // this.getUserHistory(value);
      this.getleagueDetails(value);
    }
  }

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  previousRequests:any[]=[];
  currentUser:any;
  numberOfMatches:number;
  constructor(private cdr: ChangeDetectorRef,
              private service:LeagueService,
              private toastr:ToastrService) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {}

  getleagueDetails(id:number)
  {
    if(id>0)
    {
      this.service.fetchleagueGroup(id)

        .pipe(first())
        .subscribe(
          data => {
            if (data) {
              // this.currentUser =  data.data.userInfo;
              this.previousRequests = data.data
              console.log(data.data);
              this.cdr.detectChanges();

            }
            else
            {
              this.toastr.error("Error :"+data.message+", fetching league details try again after sometime.",
                'League standing',{
                  timeOut: 3000,
                  progressBar:true,
                  tapToDismiss:true,
                  toastClass: 'flat-toast ngx-toastr'
                });
            }
          },
          error => {
            this.toastr.error("Error:"+error.toString()+", fetching league details please try again after sometime.",
              'League standing',{
                timeOut: 3000,
                progressBar:true,
                tapToDismiss:true,
                toastClass: 'flat-toast ngx-toastr'
              });
          });
    }
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  // markAsPaid(id:any) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'Do you want to mark this payment as paid?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, mark as paid',
  //   }).then((result: any) => {
  //     if (result.isConfirmed) {
  //       this.service.markPaid(id)
  //         .pipe(first())
  //         .subscribe(
  //           data => {
  //             if (data.success) {

  //               // this.cdr.detectChanges();
  //               this.getUserDetails(this._id)
  //               console.log('paid')
  
  //             }
  //             else
  //             {
  //               this.toastr.error("Error :"+data.message+", fetching user details try again after sometime.",
  //                 'Order History',{
  //                   timeOut: 3000,
  //                   progressBar:true,
  //                   tapToDismiss:true,
  //                   toastClass: 'flat-toast ngx-toastr'
  //                 });
  //             }
  //           },
  //           error => {
  //             this.toastr.error("Error:"+error.toString()+", fetching user details please try again after sometime.",
  //               'Order History',{
  //                 timeOut: 3000,
  //                 progressBar:true,
  //                 tapToDismiss:true,
  //                 toastClass: 'flat-toast ngx-toastr'
  //               });
  //           });
  //     }
  //   })
  // }

   calculateGoalDifference(input: any) {
    let row = input.closest('tr');
    let goalsPerformed = row.querySelector('.goal_performed').value;
    let goalsConceived = row.querySelector('.goal_conceived').value;
    let goalDifference = row.querySelector('.goal_difference');
    
    goalDifference.value = goalsPerformed - goalsConceived;
}

}
