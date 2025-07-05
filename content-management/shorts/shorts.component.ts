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
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClubService} from "../../../services/club.service";
import {VideoCategoryService} from "../../../services/video-category.service";
import {FeedService} from "../../../services/feed.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-shorts',
  templateUrl: './shorts.component.html',
  styleUrls: ['./shorts.component.scss']
})
export class ShortsComponent {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  addForm: FormGroup;

  shortsList:any[] = [];
  shorts$: Observable<any[]>;
  shortsInput$ = new Subject<string>();
  shortsLoading = false;
  shorts_id:number;


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

      shorts_id: [null, Validators.required],

    });
  }
  toggleVisible(item:any){
    item.visible = !item.visible;
    let message = item.title+" is now "+ (item.visible?"visible":"invisible");
    this.isLoading$.next(true);
    this.feedService.updateShortFeed({'visible':item.visible},item.id).pipe(first())
      .subscribe(
        data => {
          console.log(data);
          if (data && data.success==true) {
            this.isLoading$.next(false);
            this.cdr.detectChanges();
            this.fetchShortsList();
            this.toastr.success(message, 'Shorts Visibility',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });


          }
          else
          {
           // console.log("Internal server error, Please try again after sometime.");
            this.toastr.error('Internal server error, Please try again after sometime.', 'Shorts Feed',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });

          }
        },
        error => {
          this.toastr.error('Error:'+error.toString(), 'Shorts Visibility',{
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
    this.feedService.storeShortFeed(objValue)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          if (data && data.success==true) {
            this.isLoading$.next(false);
            this.cdr.detectChanges();
            console.log("Added Successfully");
            this.fetchShortsList();
            this.addForm.reset();
            this.toastr.success('Shorts added to feed', 'Add Shorts to Feed',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });


          }
          else
          {
           // console.log("Internal server error, Please try again after sometime.");
            this.toastr.error('Error:'+data.message+', Please try again after sometime.', 'Add Shorts to Feed',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });

          }
        },
        error => {
          this.toastr.error('Error:'+error.toString(), 'Add Shorts to Feed',{
            timeOut: 3000,
            progressBar:true,
            tapToDismiss:true,
            toastClass: 'flat-toast ngx-toastr'
          });
        });


  }


  ngOnInit(): void {
    this.loadShorts();
    this.fetchShortsList();
  }
  private fetchShortsList()
  {
    this.feedService.getShortFeedList().subscribe((value)=> {
      if(value.success == true)
      {
        this.shortsList = value.data;
        this.cdr.detectChanges();

      }
      else
      {
        this.toastr.error('Unable to fetch shorts feed, please try again after sometime.', 'Shorts Feed',{
          timeOut: 3000,
          progressBar:true,
          tapToDismiss:true,
          toastClass: 'flat-toast ngx-toastr'
        });
      }
    });
  }
  private loadShorts() {
    this.shorts$ = concat(
      of([]), // default items
      this.shortsInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.shortsLoading = true),
        switchMap(term => this.courseService.searchShorts(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.shortsLoading = false)
        ))
      )
    );
  }
  onChangeOrder(event:any){
    this.shortsList = event;
    let outputObject:any[] = [];

    this.shortsList.map((short, index)=>{

      var obj = {'id':short.id,'order':index+1}; // <----- new Object
      outputObject.push(obj);
      // console.log("chapter : "+chapter.id+":"+chapter.title+" index is now "+chapter.category_order);
    });

    this.feedService.shortOrderUpdate(outputObject)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.fetchShortsList();
          if (data && data.success==true) {
            this.toastr.success('Shorts feed order updated.', 'Shorts Feed',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });
          }
          else
          {
            this.toastr.error('Unable to update shorts feed, please try again after sometime.', 'Shorts Feed',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });
          }
        },
        error => {
          this.toastr.error('Error:'+error.getMessage(), 'Shorts Feed',{
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
      this.feedService.onDeleteShortFeed(item.id)
        .pipe(first())
        .subscribe(
          data => {
            console.log(data);
            this.fetchShortsList();
            if (data && data.success==true) {
              this.toastr.success(item.title + ' removed from shorts feed', 'Shorts Feed',{
                timeOut: 3000,
                progressBar:true,
                tapToDismiss:true,
                toastClass: 'flat-toast ngx-toastr'
              });
            }
            else
            {
              this.toastr.error('Unable to update shorts feed, please try again after sometime.', 'Shorts Feed',{
                timeOut: 3000,
                progressBar:true,
                tapToDismiss:true,
                toastClass: 'flat-toast ngx-toastr'
              });
            }
          },
          error => {
            this.toastr.error('Error:'+error.getMessage(), 'Shorts Feed',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });
          });
      return true;
    };


    this.modalBody="Are you sure you want to delete "+item.title+" from the feed ?";
    this.modalComponent.open();
  }


}
