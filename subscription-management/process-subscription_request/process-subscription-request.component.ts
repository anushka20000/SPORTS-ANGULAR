import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';

import {
  BehaviorSubject, catchError,
  concat,
  distinctUntilChanged,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
  tap
} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClubService} from "../../../services/club.service";
import {CommonService} from "../../../services/common.service";
import {VideoCategoryService} from "../../../services/video-category.service";
import { SubscriptionService } from '../../../services/subscription.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import {ToastrService} from "ngx-toastr";
@Component({
  selector: 'app-process-subscription-request',
  templateUrl: './process-subscription-request.component.html',
})
export class ProcessSubscriptionRequestComponent implements OnInit, OnDestroy {
  @Output() OnEditForm = new EventEmitter<any>();
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];

  student_id:number;
  students$: Observable<any[]>;
  studentInput$ = new Subject<string>();
  studentLoading = false;

  course_id:number;
  courses$: Observable<any[]>;
  courseInput$ = new Subject<string>();
  courseLoading = false;
  addForm: FormGroup;


  plans:any[] = [];
  durations:any[] = [];
  zones:any[] = [];



  constructor(private cdr: ChangeDetectorRef,private fb: FormBuilder, private service:ClubService,
              private commonService:CommonService,private courseService:VideoCategoryService,
              private subscriptionService:SubscriptionService,private router:Router, private toastr:ToastrService) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);

    this.addForm = this.fb.group({
      student_id: [null, Validators.required],
      course_id:[''],
      type: ['',Validators.required],
      plan:[null],
      duration:[null]
    });

  }

  private loadStudents() {
    this.students$ = concat(
      of([]), // default items
      this.studentInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.studentLoading = true),
        switchMap(term => this.service.searchStudents(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.studentLoading = false)
        ))
      )
    );
  }
  private loadCourses() {
    this.courses$ = concat(
      of([]), // default items
      this.courseInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.courseLoading = true),
        switchMap(term => this.courseService.searchCourses(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.courseLoading = false)
        ))
      )
    );
  }



  private loadOthers() {
    this.commonService.getPans().subscribe((value)=>{
      this.plans = value;
    })
    this.commonService.getDurations().subscribe((value)=>{
      this.durations = value;
    })
    this.commonService.getZones().subscribe((value)=>{
      this.zones = value;
    })

  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();
    this.loadOthers();
  }

  saveSubscriptionRequest() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.cdr.detectChanges();
    }, 1500);
  }
  public getPrice(amount:number)
  {
    if(!amount)
    amount = 0;

      return amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
      });
  }

  onInsert(objValue:any){

    objValue.user_id = objValue.student_id;
    objValue.duration_id = (objValue.duration=='')?null:objValue.duration;
    objValue.request_type = parseInt(objValue.type);
    objValue.video_category_id = (objValue.course_id=='')?null:objValue.course_id;
    objValue.subscription_plan_id = (objValue.plan=='')?null:objValue.plan;
    //console.log(objValue);
    //return false;
    this.isLoading$.next(true);
    ///// This Area for image upload
   // console.log(objValue);
    //return false;
    this.subscriptionService.subscriptionRequestStore(objValue)
      .pipe(first())
      .subscribe(
        data => {
        //  console.log(data);
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
