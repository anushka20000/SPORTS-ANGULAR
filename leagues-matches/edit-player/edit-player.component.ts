import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {generateUniqueName, getCDNImage, getPrefix} from "../../../modules/utilities/file";
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {checkFileSize, resizeImage} from "../../../modules/utilities/imageSize";
import {UploadService} from "../../../services/upload.service";
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PlayerService } from 'src/app/services/player.service';
@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['../leagues.scss']
})
export class EditPlayerComponent implements OnInit, OnDestroy {
  @Output() OnEditForm = new EventEmitter<any>();
  @Input() playerId: any = null;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  editPlayer: FormGroup;
  states:any[] = [];
  formData:any
  cities:any = {id: '0', state_id: '0', title: 'kolkata'};
  squareFile?: File;
  squareProgress:number = 0;
  square_image_path = "";
  positions: any[] = [];
  clubs: any[] = [];


  constructor(private cdr: ChangeDetectorRef, private services:PlayerService, private uploadService:UploadService,
    private router:Router,private fb: FormBuilder, private toastr:ToastrService,private http: HttpClient) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.onInsertInit();
    this.onStateInit();
    this.loadClubs()
    this.loadPositions()
  }
  loadPositions() {
    this.services.getPositions().subscribe((data) => {
      this.positions = data.data;
    });
  }
  
  loadClubs() {
    this.services.getClubs().subscribe((data) => {
      this.clubs = data.data;
    });
  }
  onInsertInit()
  {
    this.editPlayer = this.fb.group({
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
      jersey_no: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      jersey_name: ['', Validators.required],
      rank: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      total_match: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
      goal_score: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
      goal_conceived: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
      penalty_score: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
      assists: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
      total_attempts: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
      total_distance_covered: [0, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')]],
      total_followers: [0, [Validators.required, Validators.pattern('^[0-9]+$')]],
      summery: ['', Validators.required],
      detail: ['', Validators.required]
    });
   
  }



  onInsert(objValue:any){
     this.isLoading$.next(true);
     ///// This Area for image upload
     objValue.id = this.playerId
     console.log(objValue);
     if(this.square_image_path){
       objValue.profile_image = this.square_image_path ? this.square_image_path : null
     }
    // return false;
     this.services.editPlayer(objValue)
       .pipe(first())
       .subscribe(
         data => {
           console.log(data);
           if (data && data.success==true) {
             this.isLoading$.next(false);
             this.cdr.detectChanges();
             this.editPlayer.reset();
             this.toastr.success('League Updated successfully', 'Edit League',{
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
             this.toastr.error("League update process failed.", 'Edit League',{
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
    this.http.get(`${environment.apiUrl}/admin/states`).subscribe((data: any) => {
      this.states = data.data;
      console.log(this.states[0].title)
    });
  }
  loadPlayerDetails() {
    console.log("into this")
    this.http.get(`${environment.apiUrl}/admin/player/edit/${this.playerId}`).subscribe((data: any) => {
      this.formData = data.data;
      console.log(this.formData)
      console.log(this.editPlayer)
      if (this.formData) {
        this.formData.image = this.formData.image || '';
        this.editPlayer.patchValue({
          aiff_id: this.formData.aiff_id,
          name: this.formData.name,
          last_name: this.formData.last_name,
          father_name: this.formData.father_name,
          nationality: this.formData.nationality,
          birth_country: this.formData.birth_country,
          birth_state: this.formData.birth_state,
          dob: this.formData.dob,
          position_id: this.formData.position_id,
          club_id: this.formData.club_id,
          profile_image: this.formData.profile_image,
          jersey_no: this.formData.jersey_no,
          jersey_name: this.formData.jersey_name,
          rank: this.formData.rank,
          goal_score: this.formData.goal_score,
          goal_conceived: this.formData.goal_conceived,
          penalty_score: this.formData.penalty_score,
          assists: this.formData.assists,
          total_attempts: this.formData.total_attempts,
          total_distance_covered: this.formData.total_distance_covered,
          total_followers: this.formData.total_followers,
          summery: this.formData.summery,
          detail: this.formData.detail,
          playing_club_name: this.formData.playing_club_name,
        });
        

        this.cdr.detectChanges();
      }
    });
  }
  onStateInit()
   {
     
     this.services.getCountries()
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
   ngOnChanges(changes: SimpleChanges) {
    if (changes['playerId'] && changes['playerId'].currentValue) {
      this.loadPlayerDetails();
    }
  }
  
   ngOnInit(): void {
    console.log('id',this.playerId)
    if(this.playerId) {
      this.loadPlayerDetails()
    }
    this.getStates();  // Load states on component initialization

    // Listen to state_id value changes to populate cities
    this.editPlayer.get('birth_state')?.valueChanges.subscribe(stateId => {
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
  
getCities(stateId: number) {
  this.http.get(`${environment.apiUrl}/admin/cities/${stateId}`).subscribe((data: any) => {
    this.cities = data.data;
    console.log(this.cities)
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
    this.editPlayer.reset();
    this.onRemoveSquare(this.squareFile)
  }
}
