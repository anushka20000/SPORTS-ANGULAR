import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {generateUniqueName, getCDNImage, getPrefix} from "../../../modules/utilities/file";
import { ClubService } from '../../../services/club.service';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {checkFileSize, resizeImage} from "../../../modules/utilities/imageSize";
import {UploadService} from "../../../services/upload.service";
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { VideoService } from 'src/app/services/video.service';
import * as moment from 'moment';
import { VideoCategoryService } from 'src/app/services/video-category.service';
@Component({
  selector: 'app-edit-video-category',
  templateUrl: './edit-video-category.component.html',
  styleUrls: ['../leagues.scss']
})
export class EditVideoCategoryComponent implements OnInit, OnDestroy {
  @Output() OnEditForm = new EventEmitter<any>();
  @Input() videoCategoryId: number | null = null;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  editVideoCategory: FormGroup;
  formData:any
  squareFile?: File;
  squareProgress:number = 0;
  square_image_path = "";
  isPaid = false;

  id:any = 0;

  constructor(private cdr: ChangeDetectorRef, private services:VideoCategoryService, private uploadService:UploadService,private route: ActivatedRoute,
    private router:Router,private fb: FormBuilder, private toastr:ToastrService,private http: HttpClient) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.onInsertInit();
    this.onStateInit();
  }

  onInsertInit()
  {
    this.editVideoCategory = this.fb.group({
      name: ['', Validators.required],
      paid: [0, Validators.required],
      subscription_plan_id: [0],
      first_episode_free : [0],

    });
   
  }

  onInsert(objValue:any){
     this.isLoading$.next(true);
     ///// This Area for image upload
     objValue.id = this.videoCategoryId
     console.log(objValue);
    // return false;
    if(this.square_image_path){
      objValue.thumbnail_image = this.square_image_path ? this.square_image_path : null
    }
     this.services.updatecategory(objValue)
       .pipe(first())
       .subscribe(
         data => {
           console.log(data);
           if (data && data.success==true) {
             this.isLoading$.next(false);
             this.cdr.detectChanges();
             this.editVideoCategory.reset();
             this.onRemoveSquare(this.squareFile, 1)
             this.toastr.success('Video Category Updated successfully', 'Add Student',{
               timeOut: 3000,
               progressBar:true,
               tapToDismiss:true,
               toastClass: 'flat-toast ngx-toastr'
             });
             this.OnEditForm.emit(data);
           }
           else
           {
           // alert(data.message);
            this.isLoading$.next(false);
             this.toastr.error("Video Category update process failed.", 'Add Student',{
               timeOut: 3000,
               progressBar:true,
               tapToDismiss:true,
               toastClass: 'flat-toast ngx-toastr'
             });

            this.cdr.detectChanges();
           }
         },
         error => {
           this.toastr.error("Internal server error, Please try again after sometime.", 'Add Student',{
             timeOut: 3000,
             progressBar:true,
             tapToDismiss:true,
             toastClass: 'flat-toast ngx-toastr'
           });
         });
   }

  getFormattedDate(date: any) {
   const formattedDate =  moment(date).format('YYYY-MM-DD hh:mm:ss')
    return formattedDate
    }
  loadVideoDetails() {
    this.http.get(`${environment.apiUrl}/admin/video-category/edit/${this.videoCategoryId}`).subscribe((data: any) => {
      this.formData = data.data;
      console.log(this.formData)
      if (this.formData) {
        // this.formData.image = this.formData.image || '';
        this.editVideoCategory.patchValue({
          name: this.formData.name,
          paid: this.formData.paid
        });
        this.cdr.detectChanges(); // Ensure UI updates
        

      }
    });
  }
  onStateInit()
   {
     /*
     this.service.getCountries()
       .pipe(first())
       .subscribe(
         data => {
           if (data) {
            this.states = data.data;
           }
           else
           {

             this.toastr.error("Internal server error, Please try again after sometime.", 'Add Student',{
               timeOut: 3000,
               progressBar:true,
               tapToDismiss:true,
               toastClass: 'flat-toast ngx-toastr'
             });

           }
         },
         error => {
           this.toastr.error('Error:'+error.getMessage(), 'Add Student',{
             timeOut: 3000,
             progressBar:true,
             tapToDismiss:true,
             toastClass: 'flat-toast ngx-toastr'
           });
         });*/
   }
   ngOnChanges(changes: SimpleChanges) {
    if (changes['videoCategoryId'] && changes['videoCategoryId'].currentValue) {
      this.loadVideoDetails();
    }
  }
  
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    
  }

  checkBeforeUpload(file:File, type:number, minWidth:number,minHeight:number,
                    maxWidth:number,maxHeight:number,ratio:number,callBack:any) {
    checkFileSize(file).then((value: any) => {
      if (value.width && value.height) {
        const expectedWidth = value.height * ratio;
        // check if absolute difference between width and expected width is less than 10%
        if (Math.abs(value.width - expectedWidth) > value.width * 0.1) {
          this.toastr.error("Image must be of correct aspect ratio");
          callBack();
          return;
        }
        if (value.width < minWidth || value.height < minHeight) {
          this.toastr.error("Image size must be at least " + minWidth + "x" + minHeight + " pixels");
          callBack();
          return;
        }

        // console.log(event.addedFiles[0]);
        resizeImage(file, maxWidth, maxHeight).then((newFile: File | null) => {
          if (newFile !== null) {
            // console.log(newFile);

            this.handleUpload(newFile, type);
          } else {
            this.toastr.error("Error optimizing image before upload.");
            callBack();
          }
        });

      } else {
        this.toastr.error("Unable to parse image size, the image may be corrupted.");
      }
    });
  }
  onSelectSquare(event:any, type:number) {
    switch(type) {
      case 1: {
        this.squareFile = event.addedFiles[0];
        if(this.squareFile)
          // console.log('1')
          this.checkBeforeUpload(this.squareFile,1,1800,800,1800,800,1800/800,
            ()=>{this.onRemoveSquare(event, 1)});
        break;
      }

    }


  }
 
  onRemoveSquare(event:any, type: number)
  {
    switch(type) {
      case 1: {
        delete this.squareFile;
        this.squareProgress=0;
        break;
      }
     
   
    }
  
  
  }

  onProgress(event:any,type:number)
  {
    let progress = (event.loaded * 100 / event.total);
    if(progress>100)
      progress = 100;
    switch(type) {
      case 1: {
        this.squareProgress = Math.round(progress);
        break;
      }
   
      default: {
        console.log(progress)
        break;
      }
    }

  }

  private handleUpload(file:File,type:number)
  {
    if(file)
    {
      const fileName = file.name;

      const uniqueString = generateUniqueName(10);
      const extensionIndex = fileName.lastIndexOf('.');
      const extension = fileName.slice(extensionIndex + 1);
      const uniqueName = getPrefix(type)+uniqueString + '.' + extension;

      const that = this;
      const path = encodeURIComponent("images") + "/"+uniqueName;
      const uploader = this.uploadService.uploadFile(file,path,(event:any)=>{
        that.onProgress(event,type);
        that.cdr.markForCheck();
      });
      uploader.then(
        function(data) {
          // alert("Successfully uploaded photo.");
          console.log(data);
          console.log(getCDNImage(path));
          //  square_image_path = "";
          //  portrait_image_path = "";
          //  horizontal_image_path = "";
          //  TV_cover_image_path = "";
          //  og_image_path = "";

          switch(type) {
            case 1: {
              that.square_image_path = getCDNImage(path);
              break;
            }
          }
        },
        function(err) {
          console.log(err)
          console.log(err.to)
          that.toastr.error("Error uploading file:"+err,
            'Add Course',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });
        }
      );

    }

  }
  


  saveClub() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.cdr.detectChanges();
    }, 1500);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  closemodal(){
    this.editVideoCategory.reset();
    this.onRemoveSquare(this.squareFile, 1)
  }
  onPaidChange(value: string) {
    console.log(value);
    this.isPaid = value === 'yes';
    if (!this.isPaid) {
      this.editVideoCategory.patchValue({ subscription_plan_id: '' }); // Reset dropdown if "No" is selected
    }
  }
  masterClassPlans: any[] = [];
  loadMasterClassPlans() {
    // this.services.getSubscriptionPlans().subscribe((plans:any) => {
    //   console.log(plans)
    //   this.masterClassPlans = plans.data.filter((plan:any) => plan.plan_type === 5); // Filter MasterClass Pass (type 5)
    //   console.log(this.masterClassPlans)
    // });
  }
}
