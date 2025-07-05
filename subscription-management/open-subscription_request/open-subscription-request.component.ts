import {ChangeDetectorRef, Component, OnDestroy, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { SubscriptionService } from '../../../services/subscription.service';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import {CommonService} from "../../../services/common.service";
import {
  BehaviorSubject, catchError,

  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
  tap
} from "rxjs";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-open-subscription-request',
  templateUrl: './open-subscription-request.component.html',
})
export class OpenSubscriptionRequestComponent implements OnInit, OnDestroy {

  _id=0;
  get id(): number {
    return this._id;
  }
  @Input() set id(value: number) {
    this._id = value;
    if(this._id>0)
      this.onUpdateInit();
  }

  @Output() OnEditForm = new EventEmitter<any>();
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];

  student_id:any;
  students$: Observable<any[]>;
  studentInput$ = new Subject<string>();
  studentLoading = false;
  addForm: FormGroup;
  currentRequest:any = null;
  previousRequests:any[]=[];


  constructor(
    private cdr: ChangeDetectorRef,
    private commonService:CommonService,
    private fb: FormBuilder,
    private subscriptionService:SubscriptionService,
    private router:Router, private toastr:ToastrService,

    ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.onInsertInit();
  }

  getUserHistory(id:number)
  {
    if(id>0)
    this.subscriptionService.getUserSubscriptionRequests(id)

      .pipe(first())
      .subscribe(
        data => {
          if (data && data.success==true) {
            this.previousRequests =  data.data;
            //console.log(this.previousRequests);
            this.cdr.detectChanges();

          }
          else
          {
            this.toastr.error("Error :"+data.message+", fetching request history Please try again after sometime.",
              'Subscription History',{
                timeOut: 3000,
                progressBar:true,
                tapToDismiss:true,
                toastClass: 'flat-toast ngx-toastr'
              });
          }
        },
        error => {
          this.toastr.error("Error:"+error.toString()+", fetching request history Please try again after sometime.",
            'Subscription History',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });
        });
  }
  showPrice(price:any)
  {
    return price.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    })

  }
  onUpdateInit()
  {

    this.subscriptionService.getSubscriptionRequestDetails(this.id)
      .pipe(first())
      .subscribe(
        data => {
          if (data && data.success == true) {
            this.currentRequest = data.data;

            this.addForm.setValue({
              approve_request: data.data.status,
              payment_method:data.data.payment_method,
              ref_number:data.data.ref_number,
              collected_by:data.data.collected_by,
              collection_date:data.data.json_collection_date,
              notes:data.data.notes,
            });
            console.log(data);
            this.getUserHistory(data.data.user_id);

          }
          else
          {
            this.toastr.error("Error :"+data.message+", Please try again after sometime.",
              'Subscription Request',{
                timeOut: 3000,
                progressBar:true,
                tapToDismiss:true,
                toastClass: 'flat-toast ngx-toastr'
              });
          }
        },
        error => {
          this.toastr.error("Error:"+error.toString()+", Please try again after sometime.",
            'Subscription Request',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });
        });



  }
  onInsertInit()
  {
    this.addForm = this.fb.group({
      approve_request: [''],
      payment_method: [''],
      ref_number: [''],
      collected_by: [''],
      collection_date: [''],
      notes: [''],

    });
  }

  ngOnInit(): void {
  //  this.onUpdateInit();
  }

  saveSubscriptionRequest() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.cdr.detectChanges();
    }, 1500);
  }
  onUpdate(objValue:any){
    let formatted_date =  (objValue.collection_date.year) + "-" + (objValue.collection_date.month > 9 ? objValue.collection_date.month: '0'+objValue.collection_date.month ) + "-" + (objValue.collection_date.day > 9 ? objValue.collection_date.day: '0'+objValue.collection_date.day )
    objValue.collection_date = formatted_date;
    objValue.status = objValue.approve_request;
    this.isLoading$.next(true);
    ///// This Area for image upload
    console.log(objValue);
   // return false;
    this.subscriptionService.updateSubscriptionRequest(objValue,this.id)
      .pipe(first())
      .subscribe(
        data => {
          //console.log(data);
          if (data && data.success==true) {
            this.addForm.reset();
            this.toastr.success('Subscription request update successfully', 'Subscription Request',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });
            this.OnEditForm.emit(data);

            this.isLoading$.next(false);
            this.cdr.detectChanges();

          }
          else
          {
            this.toastr.error("Error :"+data.message+", Please try again after sometime.",
              'Subscription Request',{
                timeOut: 3000,
                progressBar:true,
                tapToDismiss:true,
                toastClass: 'flat-toast ngx-toastr'
              });
           this.isLoading$.next(false);
           this.cdr.detectChanges();
          }
        },
        error => {
          this.toastr.error("Error:"+error.toString()+", Please try again after sometime.",
            'Subscription Request',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });
        });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
