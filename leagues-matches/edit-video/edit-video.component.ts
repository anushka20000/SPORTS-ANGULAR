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
@Component({
  selector: 'app-edit-video',
  templateUrl: './edit-video.component.html',
  styleUrls: ['../leagues.scss']
})
export class EditVideoComponent implements OnInit, OnDestroy {
  @Output() OnEditForm = new EventEmitter<any>();
  @Input() videoId: number | null = null;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  editVideo: FormGroup;
  states:any[] = [];
  formData:any
  categories:any[] = [];
  cities:any = {id: '0', state_id: '0', title: 'kolkata'};
  squareFile?: File;
  squareProgress:number = 0;
  square_image_path = "";
  squareFile4?: File;
  squareProgress4:number = 0;
  square_image_path4 = "";
  id:any = 0;
  previousVideos: any[] = [];

  constructor(private cdr: ChangeDetectorRef, private services:VideoService, private uploadService:UploadService,private route: ActivatedRoute,
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
    this.editVideo = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      publish_date: ['',Validators.required],
      video_url: ['', Validators.required],
      category_id: ['', Validators.required],
      paid: [0, Validators.required],
      previous_video_id: [],
      next_video_id: [],
      preview_seconds: [0]

    });
   
  }

  onInsert(objValue:any){
     this.isLoading$.next(true);
     ///// This Area for image upload
     objValue.id = this.videoId
     console.log(this.square_image_path4);
     if(this.square_image_path){
      objValue.thumbnail_image = this.square_image_path ? this.square_image_path : null
    }
    if(this.square_image_path4){
      objValue.tv_banner = this.square_image_path4 ? this.square_image_path4 : null
    }
    // return false;
    console.log(objValue);
     this.services.updatevideo(objValue)
       .pipe(first())
       .subscribe(
         data => {
           console.log(data);
           if (data && data.success==true) {
             this.isLoading$.next(false);
             this.cdr.detectChanges();
             this.editVideo.reset();
             this.onRemoveSquare(this.squareFile, 1)
             this.onRemoveSquare(this.squareFile4, 2)

             this.toastr.success('Video Updated successfully', 'Edit Video',{
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
             this.toastr.error("Video update process failed.", 'Edit Video',{
               timeOut: 3000,
               progressBar:true,
               tapToDismiss:true,
               toastClass: 'flat-toast ngx-toastr'
             });

            this.cdr.detectChanges();
           }
         },
         error => {
           this.toastr.error("Internal server error, Please try again after sometime.", 'Edit Video',{
             timeOut: 3000,
             progressBar:true,
             tapToDismiss:true,
             toastClass: 'flat-toast ngx-toastr'
           });
         });
   }
   getStates() {
    this.http.get(`${environment.apiUrl}/admin/vod-match-video/video-catalogues`).subscribe((data: any) => {
      this.states = data.data;
      this.cdr.detectChanges();
      // console.log(this.states)
    });
  }
  getVideos(id: any) {
    // console.log(this.id)
    this.http.get(`${environment.apiUrl}/previous-video/`+ this.videoId + '/'+id.target.value).subscribe((data: any) => {
      this.previousVideos = data.data;
      this.cdr.detectChanges();
    });
  }
  getFormattedDate(date: any) {
   const formattedDate =  moment(date).format('YYYY-MM-DD hh:mm:ss')
    return formattedDate
    }

  loadVideoDetails() {
    this.http.get(`${environment.apiUrl}/admin/video/edit/${this.videoId}`).subscribe((data: any) => {
      this.formData = data.data;
      console.log(this.formData)

      if (this.formData) {
        // this.formData.image = this.formData.image || '';
        this.editVideo.patchValue({
          title: this.formData.title,
          description: this.formData.description,
          publish_date: this.getFormattedDate(this.formData.publish_date),
          video_url: this.formData.video_url,
          category_id: this.formData.category_id,
          paid: this.formData.paid,
          previous_video_id: this.formData.previous_video_id,
          next_video_id: this.formData.next_video_id,
          preview_seconds:this.formData.preview_seconds,

        });
        this.cdr.detectChanges(); // Ensure UI updates
    
        this.getVideos({target: {value: this.formData.category_id}});
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
    if (changes['videoId'] && changes['videoId'].currentValue) {
      this.loadVideoDetails();
     
    }
  }
  
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getStates();  // Load states on component initialization
    this.getCategories(); 
    
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
          this.checkBeforeUpload(this.squareFile,type,1800,800,1800,800,1800/800,
            ()=>{this.onRemoveSquare(event, 1)});
        break;
      }
      case 2: {
        this.squareFile4 = event.addedFiles[0];
        if(this.squareFile4)
          this.checkBeforeUpload(this.squareFile4,type,1800,800,1800,800,1800/800,
            ()=>{this.onRemoveSquare(event, 2)});
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
      case 2: {
        delete this.squareFile4;
        this.squareProgress4=0;
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
      case 2: {
        this.squareProgress4 = Math.round(progress);
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
            case 2: {
              that.square_image_path4 = getCDNImage(path);
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
  
  getCategories() {
    this.http.get(`${environment.apiUrl}/video-categories`).subscribe((data: any) => {
      this.categories = data.data;
      this.cdr.detectChanges();
      console.log(this.categories)
    });
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
    this.editVideo.reset();
    this.onRemoveSquare(this.squareFile,1)
    this.onRemoveSquare(this.squareFile4,2)

  }
}
