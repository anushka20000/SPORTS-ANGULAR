import {ChangeDetectorRef, Component, OnDestroy, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {UploadService} from "../../../services/upload.service";
import {generateUniqueName, getCDNImage, getPrefix} from "../../../modules/utilities/file";
import { VideoCategoryService } from '../../../services/video-category.service';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {CmsService} from "../../../services/cms.service";
import {checkFileSize, resizeImage} from "../../../modules/utilities/imageSize";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['../content.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {
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

  ogFile?: File;
  addForm: FormGroup;


  private unsubscribe: Subscription[] = [];

  ogProgress:number = 0;


  og_image_path = "";

  constructor(private cdr: ChangeDetectorRef, private uploadService:UploadService,
              private VideoCategoryService: VideoCategoryService,
    private router:Router,private fb: FormBuilder, private toastr:ToastrService,private cmsService: CmsService,) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);

      uploadService.setBucket("tutopiaplus");
      this.onInsertInit();
  }

  ngOnInit(): void {
    //this.onUpdateInit();
  }

  onInsertInit()
  {
    this.addForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      meta_description: [''],
    });
  }

  onUpdateInit()
  {
    this.cmsService.getValue(this.id)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.addForm.setValue({
              title: data.title,
              body:data.body,
              meta_description:data.meta_description,
             // meta_keyword:data.meta_keyword
            });

            // this.previewOgImage = data.og_image
            // this.previewVerticalImageImage = data.vertical_image;
            this.og_image_path = data.og_image;
            //alert(this.og_image_path)

          }
          else
          {
            this.toastr.error("Error :"+data.message+", Please try again after sometime.",
              'Edit Page',{
                timeOut: 3000,
                progressBar:true,
                tapToDismiss:true,
                toastClass: 'flat-toast ngx-toastr'
              });
          }
        },
        error => {
          this.toastr.error("Error:"+error.toString()+", Please try again after sometime.",
            'Edit Page',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });
        });
  }



  onSelectOg(event:any) {
    this.ogFile = event.addedFiles[0];
    if(this.ogFile)
      this.checkBeforeUpload(this.ogFile,5,1600,900,1600,900,16/9,
        ()=>{this.onRemoveOg(event)});

  }
  onRemoveOg(event:any)
  {
    delete this.ogFile;
    this.ogProgress = 0;
  }

  onProgress(event:any,type:number)
  {
    let progress = (event.loaded * 100 / event.total);
    if(progress>100)
      progress = 100;
    switch(type) {
      case 5: {
        this.ogProgress = Math.round(progress);
        break;
      }
      default: {
        console.log(progress)
        break;
      }
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
              case 5: {
                that.og_image_path = getCDNImage(path);
                break;
              }
            }
         },
         function(err) {
           that.toastr.error("Error:"+err+", when uploading file, Please try again after sometime.",
             'Edit Page',{
               timeOut: 3000,
               progressBar:true,
               tapToDismiss:true,
               toastClass: 'flat-toast ngx-toastr'
             });
         }
       );

     }

   }

  saveCourse() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.cdr.detectChanges();
    }, 1500);
  }

  onInsert(objValue:any){
   // return false;
    this.isLoading$.next(true);
    ///// This Area for image upload
     objValue.og_image = this.og_image_path;

    //objValue.trailer_file_tv = '';
    ///// End ////////////
    console.log(objValue);
   // return false;
    this.cmsService.update(objValue,this.id)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          if (data && data.success==true) {
            this.addForm.reset();
            this.toastr.success('Cms edited successfully', 'Edit Cms',{
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
              'Edit Page',{
                timeOut: 3000,
                progressBar:true,
                tapToDismiss:true,
                toastClass: 'flat-toast ngx-toastr'
              });
          }
        },
        error => {
          this.toastr.error("Error:"+error.toString()+", Please try again after sometime.",
            'Edit Page',{
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
