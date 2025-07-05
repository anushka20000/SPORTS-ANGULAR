import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
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
@Component({
  selector: 'app-add-club',
  templateUrl: './add-club.component.html',
  styleUrls: ['../leagues.scss']
})
export class AddClubComponent implements OnInit, OnDestroy {
  @Output() OnAddForm = new EventEmitter<any>();
  @Output() OnEditForm = new EventEmitter<any>();

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  addClub: FormGroup;
  states:any[] = [];
  cities:any = {id: '0', state_id: '0', title: 'kolkata'};
  squareFile?: File;
  squareProgress:number = 0;
  square_image_path = "";


  constructor(private cdr: ChangeDetectorRef, private services:ClubService, private uploadService:UploadService,
    private router:Router,private fb: FormBuilder, private toastr:ToastrService,private http: HttpClient) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.onInsertInit();
    this.onStateInit();
    uploadService.setBucket('footballindia-new-shrachi');
  }

  onInsertInit()
  {
    this.addClub = this.fb.group({
      name: ['', Validators.required],
      acronym: ['', Validators.required],
      summary: ['',],
      detail: ['', Validators.required],
      state_id: [''],
      city_id: ['']
    });
   
  }

  onInsert(objValue:any){
     this.isLoading$.next(true);
     ///// This Area for image upload
     console.log(objValue);
    //  console.log(this.squareFile)
     objValue.image = this.square_image_path ? this.square_image_path : null
    // return false;
     this.services.addClub(objValue)
       .pipe(first())
       .subscribe(
         data => {
           console.log(data);
           if (data && data.success==true) {
             this.isLoading$.next(false);
             this.cdr.detectChanges();
             this.addClub.reset();
             this.square_image_path = '';
             this.onRemoveSquare(this.squareFile)
             this.toastr.success('Club Added successfully', 'Add Club',{
               timeOut: 3000,
               progressBar:true,
               tapToDismiss:true,
               toastClass: 'flat-toast ngx-toastr'
             });
             this.OnAddForm.emit(data);
           }
           else
           {
           // alert(data.message);
            this.isLoading$.next(false);
             this.toastr.error("Club creation process failed.", 'Add Club',{
               timeOut: 3000,
               progressBar:true,
               tapToDismiss:true,
               toastClass: 'flat-toast ngx-toastr'
             });

            this.cdr.detectChanges();
           }
         },
         error => {
           this.toastr.error("Internal server error, Please try again after sometime.", 'Add Club',{
             timeOut: 3000,
             progressBar:true,
             tapToDismiss:true,
             toastClass: 'flat-toast ngx-toastr'
           });
         });
   }

   getStates() {
    this.http.get(`${environment.apiUrl}/admin/states`).subscribe((data: any) => {
      this.states = data.data;
      console.log(this.states[0].title)
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

   ngOnInit(): void {
    this.getStates();  // Load states on component initialization

    // Listen to state_id value changes to populate cities
    this.addClub.get('state_id')?.valueChanges.subscribe(stateId => {
      if (stateId) {
        this.getCities(stateId);  // Fetch cities for selected state
      } else {
        this.cities = {};  // Reset cities if no state is selected
      }
    });
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
      this.checkBeforeUpload(this.squareFile,1,256,256,500,500,1,
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
  
getCities(stateId: number) {
  this.http.get(`${environment.apiUrl}/admin/cities/${stateId}`).subscribe((data: any) => {
    this.cities = data.data;
    console.log(this.cities)
  });
}
 
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  closemodal(){
    this.addClub.reset();
    this.onRemoveSquare(this.squareFile)
  }
}
