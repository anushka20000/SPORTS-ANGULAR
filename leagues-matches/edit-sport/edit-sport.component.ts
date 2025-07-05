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
import { SportsService } from 'src/app/services/sports.service';
@Component({
  selector: 'app-edit-sport',
  templateUrl: './edit-sport.component.html',
  styleUrls: ['../leagues.scss']
})
export class EditSportComponent implements OnInit, OnDestroy {
  @Output() OnEditForm = new EventEmitter<any>();
  @Input() clubId: number | null = null;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  editClub: FormGroup;
  states:any[] = [];
  formData:any
  cities:any = {id: '0', state_id: '0', title: 'kolkata'};
  squareFile?: File;
  squareProgress:number = 0;
  square_image_path = "";


  constructor(private cdr: ChangeDetectorRef, private services: SportsService, private uploadService:UploadService,
    private router:Router,private fb: FormBuilder, private toastr:ToastrService,private http: HttpClient) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.onInsertInit();
    uploadService.setBucket('footballindia-new-shrachi');
  }

  onInsertInit()
  {
    this.editClub = this.fb.group({
       name: ['', Validators.required],
       scoring_type: [''],
    });
   
  }

  onInsert(objValue:any){
     this.isLoading$.next(true);
     objValue.id = this.clubId
    // return false;
    if(this.square_image_path){
      objValue.image = this.square_image_path ? this.square_image_path : null
    }
     this.services.editSport(objValue)
       .pipe(first())
       .subscribe(
         data => {
           console.log(data);
           if (data && data.success==true) {
             this.isLoading$.next(false);
             this.cdr.detectChanges();
             this.editClub.reset();
             this.onRemoveSquare(this.squareFile)

             this.toastr.success('Club Updated successfully', 'Add Club',{
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
             this.toastr.error("Club update process failed.", 'Add Club',{
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


  loadClubDetails() {
    this.http.get(`${environment.apiUrl}/admin/sport/edit/${this.clubId}`).subscribe((data: any) => {
      this.formData = data.data;
      if (this.formData) {
        this.editClub.patchValue({
          name: this.formData.name,
          scoring_type: this.formData.scoring_type,
          image: this.formData.image
        });
        this.cdr.detectChanges(); 
      }
    });
  }
  
   ngOnChanges(changes: SimpleChanges) {
    if (changes['clubId'] && changes['clubId'].currentValue) {
      this.loadClubDetails();
    }
  }
  
   ngOnInit(): void {
    if(this.clubId) {
      this.loadClubDetails()
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
    this.squareFile = event.addedFiles[0];
    if(this.squareFile)
      this.checkBeforeUpload(this.squareFile,1,140,140,184,184,1,
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
          switch(type) {
            case 1: {
              that.square_image_path = getCDNImage(path);
              break;
            }
          }
        },
        function(err) {
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
    this.editClub.reset();
    this.onRemoveSquare(this.squareFile)
  }

}
