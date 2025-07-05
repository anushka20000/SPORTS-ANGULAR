import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {generateUniqueName, getCDNImage, getPrefix} from "../../../modules/utilities/file";
import {first} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {checkFileSize, resizeImage} from "../../../modules/utilities/imageSize";
import {UploadService} from "../../../services/upload.service";
import {MatchService} from 'src/app/services/matches.service';

@Component({
  selector: 'app-add-match',
  templateUrl: './add-match.component.html',
  styleUrls: ['../leagues.scss']
})
export class AddMatchComponent implements OnInit, OnDestroy {
  @Output() OnAddForm = new EventEmitter<any>();
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  matchForm: FormGroup;
  states:any;
  cities:any;
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




  horizontal_banner = "";
  vertical_banner = "";
  match_poster = "";
  tv_banner = "";
  full_match_banner = ""
  goal_banner = ""
  highlight_banner = ""



  horizontalBannerFile: File | null = null;
verticalBannerFile: File | null = null;
matchPosterFile: File | null = null;
fullMatchVideoFile: File | null = null;
goalBannerFile: File | null = null;
highlightBannerFile: File | null = null;



horizontalBannerProgress: number = 0;
verticalBannerProgress: number = 0;
matchPosterProgress: number = 0;
fullMatchProgress: number = 0;
goalProgress: number = 0;
highlightProgress: number = 0;



  constructor(private cdr: ChangeDetectorRef, private service:MatchService, private uploadService:UploadService,
    private router:Router,private fb: FormBuilder, private toastr:ToastrService) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.onInsertInit();
    uploadService.setBucket('footballindia-new-shrachi');
    // this.onLeagueInit()
    // this.onStateInit();
  }
  channels = [
    { id: 0, name: 'Ch1: iLeague-1' },
    { id: 1, name: 'Ch2: iLeague - 2nd Div - 1' },
    { id: 2, name: 'Ch3: iLeague - 2nd Div - 2' },
    { id: 3, name: 'Ch4: IWL-1' },
    { id: 4, name: 'Ch5: IWL-2' },
    { id: 5, name: 'Ch6: iLeague-2' },
    { id: 6, name: 'Ch7: Standby' },
    { id: 7, name: 'Ch8: Standby-2' },
  ];

  /*
     { id: 1, name: 'Ch2: Rajmata Jijabai' },
    { id: 2, name: 'Ch3: Santosh Trophy' },
   */

  onInsertInit()
  {
    this.matchForm = this.fb.group({
      league_id: ['', Validators.required],     
      group_id: ['', Validators.required],        
      teamA_id: ['', Validators.required],         
      teamB_id: ['', Validators.required],        
      date: ['', Validators.required], 
      paid: [1, Validators.required],
      location:[''],
      ground_name:[''],
      channel_id: ['', Validators.required],
      sports_type: [0, Validators.required],
      preview_seconds: [0]

    });
   
  }

  onInsert(objValue:any){
     this.isLoading$.next(true);
     ///// This Area for image upload
    
     console.log(objValue);
    // return false;
    // console.log(this.horizontal_banner)

    objValue.horizontal_banner = this.horizontal_banner ? this.horizontal_banner : null
    objValue.vertical_banner = this.vertical_banner ? this.vertical_banner : null
    objValue.match_poster = this.match_poster ? this.match_poster : null
    objValue.tv_banner = this.tv_banner ? this.tv_banner : null
    objValue.full_match_banner = this.full_match_banner ? this.full_match_banner : null
    objValue.goal_banner = this.goal_banner ? this.goal_banner : null
    objValue.highlight_banner = this.highlight_banner ? this.highlight_banner : null

    const localDate = new Date(objValue.date);
    objValue.date = Math.floor(localDate.getTime() / 1000);


     this.service.store(objValue)
       .pipe(first())
       .subscribe(
         data => {
           console.log(data);
           if (data && data.success==true) {
             this.isLoading$.next(false);
             this.matchForm.reset();
             this.onRemoveSquare(this.squareFile1,1)
             this.onRemoveSquare(this.squareFile2,2)
             this.onRemoveSquare(this.squareFile3,3)
             this.onRemoveSquare(this.squareFile4,4)
             this.onRemoveSquare(this.squareFile5,5)
             this.onRemoveSquare(this.squareFile6,6)
             this.onRemoveSquare(this.squareFile7,7)
             this.cdr.detectChanges();
             this.toastr.success('Match Added successfully', 'Add Match',{
               timeOut: 3000,
               progressBar:true,
               tapToDismiss:true,
               toastClass: 'flat-toast ngx-toastr'
             });
             this.OnAddForm.emit(data);
             this.cdr.detectChanges();

           }
           else
           {
           // alert(data.message);
            this.isLoading$.next(false);
             this.toastr.error("Match creation process failed.", 'Add Match',{
               timeOut: 3000,
               progressBar:true,
               tapToDismiss:true,
               toastClass: 'flat-toast ngx-toastr'
             });

            this.cdr.detectChanges();
           }
         },
         error => {
           this.toastr.error("Internal server error, Please try again after sometime.", 'Add Match',{
             timeOut: 3000,
             progressBar:true,
             tapToDismiss:true,
             toastClass: 'flat-toast ngx-toastr'
           });
         });
   }
leagues:any = []

  onStateInit()
   {
     
     this.service.getLeagues()
       .pipe(first())
       .subscribe(
         data => {
           if (data) {
            this.leagues = data.data;
            console.log(data)
            this.cdr.detectChanges();
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
         (error:any) => {
           this.toastr.error('Error:'+error.getMessage(), 'Add Student',{
             timeOut: 3000,
             progressBar:true,
             tapToDismiss:true,
             toastClass: 'flat-toast ngx-toastr'
           });
         });
   }
groups:any = []
    
onGroupInit() {
  this.service.getGroups()
    .pipe(first())
    .subscribe(
      (data:any) => {
        if (data) {
          this.groups = data;
          this.cdr.detectChanges()
        } else {
          this.toastr.error('Internal server error, Please try again after sometime.', 'Add Match');
        }
      },
      (error:any) => {
        this.toastr.error('Error: ' + error.getMessage(), 'Add Match');
      }
    );
}

teams:any = []
onLeagueSelect(event: any): void {
  const selectedLeagueId = event.target.value;
  if (selectedLeagueId) {
    this.onTeamInit(selectedLeagueId);
  } else {
    this.teams = []; // Clear teams if no league is selected
  }
}
onTeamInit(leagueId: any) {
  this.service.getleagueClubs(leagueId)
    .pipe(first())
    .subscribe(
      (data:any) => {
        if (data) {
          this.teams = data;
          console.log(data)
        } else {
          this.toastr.error('Internal server error, Please try again after sometime.', 'Add Match');
        }
      },
      (error:any) => {
        this.toastr.error('Error: ' + error.getMessage(), 'Add Match');
      }
    );
}
  ngOnInit(): void {
    this.onStateInit()
    // this.onLeagueInit();
    this.onGroupInit();
    // this.onTeamInit();
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
        this.squareFile1 = event.addedFiles[0];
        if(this.squareFile1)
          // console.log('1')
          this.checkBeforeUpload(this.squareFile1,type,292,165,292,165,292/165,
            ()=>{this.onRemoveSquare(event, 1)});
        break;
      }
      case 2: {
        this.squareFile2 = event.addedFiles[0];
        if(this.squareFile2)
          this.checkBeforeUpload(this.squareFile2,type,230,308,230,308,230/308,
            ()=>{this.onRemoveSquare(event, 2)});
        break;
      }
      case 3: {
        this.squareFile3 = event.addedFiles[0];
        if(this.squareFile3)
          this.checkBeforeUpload(this.squareFile3,type,292,165,292,165,292/165,
            ()=>{this.onRemoveSquare(event, 3)});
        break;
      }
      case 4: {
        this.squareFile4 = event.addedFiles[0];
        if(this.squareFile4)
          this.checkBeforeUpload(this.squareFile4,type,1920,1080,1920,1080,1920/1080,
            ()=>{this.onRemoveSquare(event,4)});
        break;
      }
      case 5: {
        this.squareFile5 = event.addedFiles[0];
        if(this.squareFile5)
          this.checkBeforeUpload(this.squareFile5,type,230,308,230,308,230/308,
            ()=>{this.onRemoveSquare(event,5)});
        break;
      }
      case 6: {
        this.squareFile6 = event.addedFiles[0];
        if(this.squareFile6)
          this.checkBeforeUpload(this.squareFile6,type,292,165,292,165,292/165,
            ()=>{this.onRemoveSquare(event,6)});
        break;
      }
      case 7: {
        this.squareFile7 = event.addedFiles[0];
        if(this.squareFile7)
          this.checkBeforeUpload(this.squareFile7,type,292,165,292,165,292/165,
            ()=>{this.onRemoveSquare(event,7)});
        break;
      }
    }


  }

  onRemoveSquare(event:any, type: number)
  {
    switch(type) {
      case 1: {
        delete this.squareFile1;
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
        this.squareProgress4 = 0;
        break;
       
      }
      case 5: {
        delete this.squareFile5;
        this.squareProgress5 = 0;
        break;
       
      }
      case 6: {
        delete this.squareFile6;
        this.squareProgress6 = 0;
        break;
       
      }
      case 7: {
        delete this.squareFile7;
        this.squareProgress7 = 0;
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
      case 7: {
        this.squareProgress7 = Math.round(progress);
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
              console.log('h')
              that.horizontal_banner = getCDNImage(path);

              break;
            }
            case 2: {
              console.log('v')

              that.vertical_banner = getCDNImage(path);

              break;
            }
            case 3: {
              console.log('m')

              that.match_poster = getCDNImage(path);

              break;
            }
            case 4: {
              console.log('m')

              that.tv_banner = getCDNImage(path);

              break;
            }
            case 5: {
              console.log('m')

              that.full_match_banner = getCDNImage(path);

              break;
            }
            case 6: {
              console.log('m')

              that.goal_banner = getCDNImage(path);

              break;
            }
            case 7: {
              console.log('m')

              that.highlight_banner = getCDNImage(path);

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
    this.matchForm.reset();
             this.onRemoveSquare(this.squareFile1,1)
             this.onRemoveSquare(this.squareFile2,2)
             this.onRemoveSquare(this.squareFile3,3)
             this.onRemoveSquare(this.squareFile4,4)
             this.onRemoveSquare(this.squareFile5,5)
             this.onRemoveSquare(this.squareFile6,6)
             this.onRemoveSquare(this.squareFile7,7)
  }
}
