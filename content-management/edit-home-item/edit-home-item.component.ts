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
import { HomeService } from 'src/app/services/home.service';
import { calculateLocalDateTime } from 'src/app/modules/utilities/date';
@Component({
  selector: 'app-edit-home-item',
  templateUrl: './edit-home-item.component.html',
  styleUrls: ['../content.scss']
})
export class EditHomeItemComponent implements OnInit, OnDestroy {
  @Output() OnEditForm = new EventEmitter<any>();
  @Input() videoId: number | null = null;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  editItem: FormGroup;
  states:any[] = [];
  cities:any = {id: '0', state_id: '0', title: 'kolkata'};
  squareFile?: File;
  squareProgress:number = 0;
  id:any = 0;
  formData:any
  squareFile1?: File;
  squareFile2?: File;
  squareFile3?: File;
  squareFile4?: File;
  squareFile5?: File;
  squareFile6?: File;
  squareFile7?: File;

  squareProgress1:number = 0;
  squareProgress2:number = 0;
  squareProgress3:number = 0;
  squareProgress4:number = 0;
  squareProgress5:number = 0;
  squareProgress6:number = 0;
  squareProgress7:number = 0;

  teamA = "";
  teamB = "";
  league_logo = "";
  match_poster = "";
  vertical = "";
  tvbanner = ""
  // highlight_banner = ""

  horizontalBannerFile: File | null = null;
verticalBannerFile: File | null = null;
matchPosterFile: File | null = null;
fullMatchVideoFile: File | null = null;
goalBannerFile: File | null = null;
highlightBannerFile: File | null = null;

getFormattedDate(timestamp: number): string {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  
  // Extract individual components
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  // Combine into a formatted string
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate
  }
  constructor(private cdr: ChangeDetectorRef, private services: HomeService, private uploadService:UploadService,
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
    this.editItem = this.fb.group({
      match_id: ['', Validators.required],
      match_status: [''],
      team_a_id: [''],
      team_b_id: [''],
      league_name: [''],
      team_a_name: [''],
      team_a_score: [''],
      team_b_name: [''],
      team_b_score: [''],
      match_time_start: [''],
      video_url: [''],
      type: [''],
      sports_type: [0],
      order: [''],
      duration: [''],
      tv_banner: [''],
      title: [''],
      sub_title: [''],
    });
   
  }
  data:any = null;
  matchList:any = null;
  selectedMatchId: any = null;
  onMatchSelect(event: Event): void {
    this.selectedMatchId = (event.target as HTMLSelectElement).value;
    if (this.selectedMatchId) {
      this.http.get(`${environment.apiUrl}/admin/match/edit/${this.selectedMatchId}`).subscribe((data: any) => {
        this.data = data.data.match
        console.log(data.data)
        this.editItem.patchValue({
          team_a_name: data.data.team[0].Club.name,
          team_b_name: data.data.team[1].Club.name,
          league_name: data.data.match?.League?.name
        })
          this.cdr.detectChanges();
        
    })
    } else {
      this.editItem.reset(); // Reset form if no match selected
    }
  }
  onInsert(objValue:any){
     this.isLoading$.next(true);
     console.log(objValue);
    // return false;
    if(this.teamA){
      objValue.team_a_logo = this.teamA ? this.teamA : null
    }
    if(this.teamB){
      objValue.team_b_logo = this.teamB ? this.teamB : null
    }
    if(this.league_logo){
      objValue.league_logo = this.league_logo ? this.league_logo : null
    }
    if(this.match_poster){
      objValue.match_poster_horizontal = this.match_poster ? this.match_poster : null
    }
    if(this.vertical){
      objValue.match_poste_vertical = this.vertical ? this.vertical : null
    }
    if(this.tvbanner){
      objValue.tv_banner = this.tvbanner ? this.tvbanner : null
    }
    const localDate = new Date(objValue.match_time_start);
    objValue.match_time_start = Math.floor(localDate.getTime() / 1000);
     objValue.id = this.videoId
     console.log(objValue);
     this.services.editItem(objValue)
       .pipe(first())
       .subscribe(
         (data: any) => {
          //  console.log(data);
           if (data && data.success==true) {
             this.isLoading$.next(false);
             this.cdr.detectChanges();
             this.editItem.reset();
             this.onRemoveSquare(this.squareFile1,1)
             this.onRemoveSquare(this.squareFile2,2)
             this.onRemoveSquare(this.squareFile3,3)
             this.onRemoveSquare(this.squareFile4,4)
             this.onRemoveSquare(this.squareFile5,5)
             this.onRemoveSquare(this.squareFile6,6)
             this.toastr.success('Item updated successfully', 'Edit item',{
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
             this.toastr.error("Item updation process failed.", 'Edit item',{
               timeOut: 3000,
               progressBar:true,
               tapToDismiss:true,
               toastClass: 'flat-toast ngx-toastr'
             });

            this.cdr.detectChanges();
           }
         },
         (error: any) => {
           this.toastr.error("Internal server error, Please try again after sometime.", 'Edit item',{
             timeOut: 3000,
             progressBar:true,
             tapToDismiss:true,
             toastClass: 'flat-toast ngx-toastr'
           });
         });
   }
   loadMatchDetails() {
    this.http.get(`${environment.apiUrl}/admin/matches`).subscribe((data: any) => {
      this.matchList = data.data
        this.cdr.detectChanges();
      
  })
}
dataList:any = null
   loadDetails(id: any) {
    this.http.get(`${environment.apiUrl}/admin/item/edit/`+ id).subscribe((data: any) => {
      this.dataList = data.data
      this.editItem.patchValue({
        match_id: data.data.match_id,
        team_a_name: data.data.team_a_name,
        team_b_name: data.data.team_b_name,
        league_name: data.data.league_name,
        horizontal_banner: data.data.match_poster_horizontal,
        vertical_banner: data.data.match_poster_vertical, 
        duration: data.data.duration,
        match_time_start: this.getFormattedDate(Number(data.data.match_time_start)),
        type: data.data.type,
        sports_type: data.data.sports_type,
        match_status: data.data.match_status,
        team_a_score: data.data.team_a_score,
        team_b_score: data.data.team_b_score,
        title: data.data.title,
        sub_title: data.data.sub_title
      });
        this.cdr.detectChanges();
      
  })
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
this.checkBeforeUpload(this.squareFile,type,500,500,500,500,500/500,
()=>{this.onRemoveSquare(event, 1)});
break;
}
case 2: {
this.squareFile2 = event.addedFiles[0];
if(this.squareFile2)
this.checkBeforeUpload(this.squareFile2,type,500,500,500,500,500/500,
()=>{this.onRemoveSquare(event, 2)});
break;
}
case 3: {
this.squareFile3 = event.addedFiles[0];
if(this.squareFile3)
this.checkBeforeUpload(this.squareFile3,type,500,500,500,500,500/500,
()=>{this.onRemoveSquare(event, 3)});
break;
}
case 4: {
this.squareFile4 = event.addedFiles[0];
if(this.squareFile4)
this.checkBeforeUpload(this.squareFile4,type,1800,800,1800,800,1800/800,
()=>{this.onRemoveSquare(event, 4)});
break;
}
case 5: {
  this.squareFile5 = event.addedFiles[0];
  if(this.squareFile5)
  this.checkBeforeUpload(this.squareFile5,type,335,447,335,447,335/447,
  ()=>{this.onRemoveSquare(event, 5)});
  break;
  }
  case 6: {
    this.squareFile6 = event.addedFiles[0];
    if(this.squareFile6)
    this.checkBeforeUpload(this.squareFile6,type,1920,800,1920,800,1920/800,
    ()=>{this.onRemoveSquare(event, 6)});
    break;
    }
  
}


}

onRemoveSquare(event:any, type: number)
{
switch(type) {
case 1: {
delete this.squareFile;
this.squareProgress1=0;
break;
}
case 2: {
delete this.squareFile2;
this.squareProgress2=0;
break;
}
case 3: {
delete this.squareFile3;
this.squareProgress3=0;
break;

}
case 4: {
delete this.squareFile4;
this.squareProgress4=0;
break;

}
case 5: {
  delete this.squareFile5;
  this.squareProgress5=0;
  break;
  
  }case 6: {
    delete this.squareFile6;
    this.squareProgress6=0;
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
this.squareProgress1 = Math.round(progress);
break;
}
case 2: {
this.squareProgress2 = Math.round(progress);
break;
}
case 3: {
  this.squareProgress3 = Math.round(progress);
  break;
  }
  case 4: {
    this.squareProgress4 = Math.round(progress);
    break;
    }
    case 5: {
      this.squareProgress5 = Math.round(progress);
      break;
      }
      case 6: {
        this.squareProgress6 = Math.round(progress);
        break;
        }
      
default: {
console.log(progress)
break;
}
}

}
uploadedImage:any;
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
that.teamA = getCDNImage(path);

break;
}
case 2: {
that.teamB = getCDNImage(path);

break;
}
case 3: {
that.league_logo = getCDNImage(path);

break;
}
case 4: {
that.match_poster = getCDNImage(path);

break;
}
case 5: {
  that.vertical = getCDNImage(path);
  
  break;
  }
  case 6: {
    that.tvbanner = getCDNImage(path);
    
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
fetchMatchDetails(): void {
  console.log('Fetching match details...');
  // Call the API or perform any action to fetch match details
  this.services.fetchMatchDetails(this.selectedMatchId).subscribe(
    (details) => {
      console.log('Match details fetched:', details);
      // this.populateForm(details); // Populate form with fetched data
    },
    (error) => {
      console.error('Error fetching match details:', error);
    }
  );
}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoId'] && changes['videoId'].currentValue) {
      this.loadDetails(this.videoId);
    }
  }

   ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadMatchDetails()
    
    // this.getStates()
    if(this.videoId){
      // console.log(this.videoId, 'hello')
      this.loadDetails(this.videoId)
    }

  } 
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  closemodal(){
    this.editItem.reset();
  }
}
