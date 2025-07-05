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
@Component({
  selector: 'app-edit-match-video',
  templateUrl: './edit-match-video.component.html',
  styleUrls: ['../leagues.scss']
})
export class EditMatchVideoComponent implements OnInit, OnDestroy {
  @Output() OnEditForm = new EventEmitter<any>();
  @Input() videoId: number | null = null;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  editMatchVideo: FormGroup;
  states:any[] = [];
  cities:any = {id: '0', state_id: '0', title: 'kolkata'};
  squareFile?: File;
  squareProgress:number = 0;
  square_image_path = "";
  id:any = 0;
  formData:any



  constructor(private cdr: ChangeDetectorRef, private services: VideoService, private uploadService:UploadService,
    private router:Router,private fb: FormBuilder, private toastr:ToastrService,private http: HttpClient, private route: ActivatedRoute) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.onInsertInit();
    uploadService.setBucket('footballindia-new-shrachi');
  }

  onInsertInit()
  {
    this.editMatchVideo = this.fb.group({
      title: ['', Validators.required],
      sub_title: ['', Validators.required],
      time: ['',Validators.required],
      video_url: ['', Validators.required]
    });
   
  }

  onInsert(objValue:any){
     this.isLoading$.next(true);
     ///// This Area for image upload
     //  console.log(this.squareFile)
     if(this.square_image_path){

       objValue.image_url = this.square_image_path ? this.square_image_path : null
     }else{
       objValue.image_url = this.formData.image_url
     }
     objValue.type = 1
     objValue.match_id = this.id
     objValue.id = this.videoId

     console.log(objValue);
    // return false;
     this.services.editMatchVideo(objValue)
       .pipe(first())
       .subscribe(
         data => {
          //  console.log(data);
           if (data && data.success==true) {
             this.isLoading$.next(false);
             this.cdr.detectChanges();
             this.editMatchVideo.reset();
             this.onRemoveSquare(this.squareFile)

             this.toastr.success('Match Video Added successfully', 'Add Match Video',{
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
             this.toastr.error("Student creation process failed.", 'Add Student',{
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

   getStates() {
    this.http.get(`${environment.apiUrl}/admin/match-video/video-catalogues`).subscribe((data: any) => {
      this.states = data.data;
      this.cdr.detectChanges();
      // console.log(this.states)
    });
  }
  loadMatchVideoDetails() {
    this.http.get(`${environment.apiUrl}/admin/match-video/edit/${this.videoId}`).subscribe((data: any) => {
      this.formData = data.data;
      console.log(this.formData)
      // console.log(this.editMatch)
      // console.log(this.formData.team[1].id)
      if (this.formData) {
        // this.formData.image = this.formData.image || '';
        this.editMatchVideo.patchValue({
          title: this.formData.title,
      sub_title: this.formData.sub_title,
      time: this.formData.time,
      video_url: this.formData.video_url
        });
        this.cdr.detectChanges();
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoId'] && changes['videoId'].currentValue) {
      this.loadMatchVideoDetails();
    }
  }

   ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    
    this.getStates()
    if(this.videoId){
      console.log(this.videoId, 'hello')
      this.loadMatchVideoDetails()
    }

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
  onSelectSquare(event:any) {
    //console.log(event.addedFiles[0]);
    this.squareFile = event.addedFiles[0];
    if(this.squareFile)
      this.checkBeforeUpload(this.squareFile,1,1800,800,1800,800,1800/800,
        ()=>{this.onRemoveSquare(event)});

  }
  onRemoveSquare(event:any)
  {
    delete this.squareFile;
    this.squareProgress=0;
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
      const path = encodeURIComponent("match_images") + "/"+uniqueName;
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
    this.editMatchVideo.reset();
    this.onRemoveSquare(this.squareFile)
  }

}
