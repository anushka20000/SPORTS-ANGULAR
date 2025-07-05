import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscription} from "rxjs";
import {generateUniqueName, getCDNImage, getPrefix} from "../../../modules/utilities/file";
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {checkFileSize, resizeImage} from "../../../modules/utilities/imageSize";
import {UploadService} from "../../../services/upload.service";
import { PlayerService } from 'src/app/services/player.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['../leagues.scss']
})
export class AddPlayerComponent implements OnInit, OnDestroy {
  @Output() OnAddForm = new EventEmitter<any>();
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  playerForm: FormGroup;
  positions: any[] = [];
  clubs: any[] = [];
  states:any[] = [];

  teams$: Observable<any[]>;
  teamsinput$ = new Subject<string>();
  teamsLoading = false;

  cities:any;
  squareFile?: File;
  squareProgress:number = 0;
  square_image_path = "";

  constructor(private cdr: ChangeDetectorRef, private service:PlayerService, private uploadService:UploadService,
    private router:Router,private fb: FormBuilder, private toastr:ToastrService, private http: HttpClient) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.onInsertInit();
    this.loadClubs()
    this.loadPositions()
    this.onStateInit();

  }

  onInsertInit() {
    this.playerForm = this.fb.group({
        aiff_id: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_-]+$')]],
        name: ['', Validators.required],
        last_name: ['', Validators.required],
        father_name: ['', Validators.required],
        nationality: ['', Validators.required],
        // birth_country: ['', Validators.required],
        // birth_state: ['', Validators.required],
        dob: ['', Validators.required],
        position_id: ['', Validators.required],
        club_id: ['', Validators.required],
        jersey_name: ['', Validators.required],
        jersey_no: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        rank: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        total_match: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        goal_score: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        goal_conceived: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        penalty_score: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        assists: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        total_attempts: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        total_distance_covered: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')]],
        total_followers: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        summery: ['', Validators.required],
        detail: ['', Validators.required]
      });
  }
  loadPositions() {
    this.service.getPositions().subscribe((data) => {
      this.positions = data.data;
    });
  }
  
  loadClubs() {
    this.service.getClubs().subscribe((data) => {
      this.clubs = data.data;
    });
  }
   getStates() {
    this.http.get(`${environment.apiUrl}/admin/states`).subscribe((data: any) => {
      this.states = data.data;
      console.log(this.states[0].title)
    });
  }
  onInsert(objValue:any){
     this.isLoading$.next(true);
     ///// This Area for image upload
     console.log(objValue);
    // return false;
    objValue.profile_image = this.square_image_path ? this.square_image_path : null
     this.service.addPlayer(objValue)
       .pipe(first())
       .subscribe(
         (data:any) => {
           console.log(data);
           if (data && data.success==true) {
             this.isLoading$.next(false);
             this.cdr.detectChanges();
             this.playerForm.reset();
             this.square_image_path = ""
             this.onRemoveSquare(this.squareFile)

             this.toastr.success('Player Added successfully', 'Add Player',{
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
             this.toastr.error("Player creation process failed.", 'Add Player',{
               timeOut: 3000,
               progressBar:true,
               tapToDismiss:true,
               toastClass: 'flat-toast ngx-toastr'
             });

            this.cdr.detectChanges();
           }
         },
         (error: Error) => {
           this.toastr.error("Internal server error, Please try again after sometime.", 'Add Player',{
             timeOut: 3000,
             progressBar:true,
             tapToDismiss:true,
             toastClass: 'flat-toast ngx-toastr'
           });
         });
   }
  

  ngOnInit(): void {
    this.loadClubs()
    this.loadPositions()
  }
  onStateInit()
   {
     
     this.service.getCountries()
       .pipe(first())
       .subscribe(
         data => {
           if (data) {
            this.states = data.data;
           }
           else
           {

             this.toastr.error("Internal server error, Please try again after sometime.", 'Country',{
               timeOut: 3000,
               progressBar:true,
               tapToDismiss:true,
               toastClass: 'flat-toast ngx-toastr'
             });

           }
         },
         error => {
           this.toastr.error('Error:'+error.getMessage(), 'Country',{
             timeOut: 3000,
             progressBar:true,
             tapToDismiss:true,
             toastClass: 'flat-toast ngx-toastr'
           });
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
      this.checkBeforeUpload(this.squareFile,1,500,500,500,500,1,
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

  fetchTeams(team:any) {

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
    this.playerForm.reset();
    this.onRemoveSquare(this.squareFile)
  }
}
