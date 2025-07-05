import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {TutopiaModalConfig} from "../../../modules/modal/TutopiaModal/modal.config";
import {TutopiaModalComponent} from "../../../modules/modal/TutopiaModal/modal.component";
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
import {ClubService} from "../../../services/club.service";
import {VideoCategoryService} from "../../../services/video-category.service";
import {FeedService} from "../../../services/feed.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first, map} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  addForm: FormGroup;
  courseList:any[] = [];
  courses$: Observable<any[]>;
  courseInput$ = new Subject<string>();
  courseLoading = false;
  course_id:number;

  modalConfig: TutopiaModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal_window') private modalComponent:TutopiaModalComponent;
  modalBody="";

  constructor(private cdr: ChangeDetectorRef, private service:ClubService, private courseService:VideoCategoryService,
              private feedService:FeedService,
              private router:Router,private fb: FormBuilder, private toastr:ToastrService) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.onInsertInit();

  }

  onInsertInit()
  {
    this.addForm = this.fb.group({

      course_id: [null, Validators.required],

    });
  }
  toggleVisible(item:any){
    item.visible = !item.visible;
    let message = item.name+" is now "+ (item.visible?"visible":"invisible");
    this.isLoading$.next(true);
    this.feedService.updateCourseFeed({'visible':item.visible},item.id).pipe(first())
      .subscribe(
        data => {
          console.log(data);
          if (data && data.success==true) {
            this.isLoading$.next(false);
            this.cdr.detectChanges();
            this.fetchCourseList();
            this.toastr.success(message, 'Course Visibility',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });


          }
          else
          {
            //console.log("Internal server error, Please try again after sometime.");
            this.toastr.error('Internal server error, Please try again after sometime.', 'Add Course to Feed',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });

          }
        },
        error => {
          this.toastr.error('Error:'+error.toString(), 'Course Visibility',{
            timeOut: 3000,
            progressBar:true,
            tapToDismiss:true,
            toastClass: 'flat-toast ngx-toastr'
          });
        });
  }

  onInsert(objValue:any){
    this.isLoading$.next(true);
    ///// This Area for image upload
    console.log(objValue);
    // return false;
    this.feedService.storeCourseFeed(objValue)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          if (data && data.success==true) {
            this.isLoading$.next(false);
            this.cdr.detectChanges();
            console.log("Added Successfully");
            this.fetchCourseList();
            this.addForm.reset();
            this.toastr.success('Course added to feed', 'Add Course to Feed',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });


          }
          else
          {
            //console.log("Internal server error, Please try again after sometime.");
            this.toastr.error('Internal server error, Please try again after sometime.', 'Add Course to Feed',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });

          }
        },
        error => {
          this.toastr.error('Error:'+error.toString(), 'Add Course to Feed',{
            timeOut: 3000,
            progressBar:true,
            tapToDismiss:true,
            toastClass: 'flat-toast ngx-toastr'
          });
        });


  }


  ngOnInit(): void {
    this.loadCourses();
    this.fetchCourseList();
  }
  private fetchCourseList()
  {
    this.feedService.getCourseFeedList().subscribe((value)=> {
      if(value.success == true)
      {
        this.courseList = value.data;
        this.cdr.detectChanges();

      }
      else
      {
        this.toastr.error('Unable to fetch course feed, please try again after sometime.', 'Course Feed',{
          timeOut: 3000,
          progressBar:true,
          tapToDismiss:true,
          toastClass: 'flat-toast ngx-toastr'
        });
      }
    });
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
  onChangeOrder(event:any){
    this.courseList = event;
    let outputObject:any[] = [];

    this.courseList.map((course,index)=>{

      var obj = {'id':course.id,'order':index+1}; // <----- new Object
      outputObject.push(obj);
      // console.log("chapter : "+chapter.id+":"+chapter.title+" index is now "+chapter.category_order);
    });

    this.feedService.courseOrderUpdate(outputObject)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.fetchCourseList();
          if (data && data.success==true) {
            this.toastr.success('Course feed order updated.', 'Course Feed',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });
          }
          else
          {
            this.toastr.error('Unable to update course feed, please try again after sometime.', 'Course Feed',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });
          }
        },
        error => {
          this.toastr.error('Error:'+error.getMessage(), 'Course Feed',{
            timeOut: 3000,
            progressBar:true,
            tapToDismiss:true,
            toastClass: 'flat-toast ngx-toastr'
          });
        });
    //console.log(outputObject)

  }
  onDelete(item:any){
    this.modalConfig.modalTitle = "Confirm delete";
    //this.modalConfig.closeButtonLabel = "Yes";
    this.modalConfig.dismissButtonLabel = "Yes";
    this.modalConfig.onClose = ()=>{
      //console.log("do not delete");
      return true;
    };
    this.modalConfig.onDismiss = ()=>{
      this.feedService.onDeleteCourseFeed(item.id)
        .pipe(first())
        .subscribe(
          data => {
            console.log(data);
            this.fetchCourseList();
            if (data && data.success==true) {
              this.toastr.success(item.name + ' removed from course feed', 'Course Feed',{
                timeOut: 3000,
                progressBar:true,
                tapToDismiss:true,
                toastClass: 'flat-toast ngx-toastr'
              });
            }
            else
            {
              this.toastr.error('Unable to update course feed, please try again after sometime.', 'Course Feed',{
                timeOut: 3000,
                progressBar:true,
                tapToDismiss:true,
                toastClass: 'flat-toast ngx-toastr'
              });
            }
          },
          error => {
            this.toastr.error('Error:'+error.getMessage(), 'Course Feed',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });
          });
      return true;
    };


    this.modalBody="Are you sure you want to delete "+item.name+" from the feed ?";
    this.modalComponent.open();
  }





}
