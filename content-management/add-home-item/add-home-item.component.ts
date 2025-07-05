import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
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
  selector: 'app-add-home-item',
  templateUrl: './add-home-item.component.html',
  styleUrls: ['../content.scss']
})
export class AddHomeItemComponent implements OnInit, OnDestroy {
  @Output() OnAddForm = new EventEmitter<any>();

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  squareFile?: File;
  squareProgress:number = 0;
  square_image_path = "";
  id:any = 0;
  type: any
  
  addItem: FormGroup;
  matchList: any[] = [];

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
    this.addItem = this.fb.group({
      match_id: ['', Validators.required],
      match_status: [''],
      team_a_id: [''],
      team_b_id: [''],
      league_name: [''],
      league_logo: [''],
      team_a_name: [''],
      team_a_logo: [''],
      team_a_score: [''],
      team_b_name: [''],
      team_b_logo: [''],
      team_b_score: [''],
      match_poster_horizontal: [''],
      match_poster_vertical: [''],
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

  team_a_logo = null;
  team_b_logo = null;
  horizontal_banner = null;
  vertical_banner = null;
  tv_banner = null;
  league_logo = null;
  onMatchSelect(event: Event): void {
    const matchId = (event.target as HTMLSelectElement).value;
    let url;
    if(this.type == 2){
      url = `${environment.apiUrl}/admin/match-videos/`
      if (matchId) {
        this.http.get(url+`${matchId}`).subscribe((data: any) => {
          this.data = data.data
          console.log(data.data)
          this.team_a_logo = data?.data?.Match?.MatchDetails[0].Club.image
          this.team_b_logo = data?.data?.Match?.MatchDetails[1].Club.image
          this.horizontal_banner = data?.data?.Match?.horizontal_banner
          this.vertical_banner = data?.data?.Match?.vertical_banner
          this.tv_banner = data?.data?.Match?.tv_banner
          this.league_logo = data?.data?.Match?.League.image

          this.addItem.patchValue({
            title: data.data?.title,
            sub_title: data.data?.sub_title,
            duration: data.data?.time,
            team_a_name: data.data?.Match?.MatchDetails[0].Club.name,
            team_b_name: data.data?.Match?.MatchDetails[1].Club.name,
            sports_type: data.data?.Match?.sports_type,
            match_time_start: calculateLocalDateTime(data.data?.Match?.date),
            team_a_score: data.data?.Match?.MatchDetails[0]?.goal_score,
            team_b_score: data.data?.Match?.MatchDetails[1]?.goal_score,
            match_status: data.data?.Match?.status,
            league_name: data.data?.Match?.League.name
          })
           
            this.cdr.detectChanges();
          
      })
      } else {
        this.addItem.reset(); // Reset form if no match selected
      }
    }else{

      url = `${environment.apiUrl}/admin/match/edit/`
      if (matchId) {
        this.http.get(url+`${matchId}`).subscribe((data: any) => {
          this.data = data.data
          console.log(data.data)
          this.team_a_logo = data?.data?.team[0].Club.image
          this.team_b_logo = data?.data?.team[1].Club.image
          this.horizontal_banner = data?.data?.match?.horizontal_banner
          this.vertical_banner = data?.data?.match?.vertical_banner
          this.tv_banner = data?.data?.match?.tv_banner
          this.league_logo = data?.data?.match?.League.image
          this.addItem.patchValue({
            team_a_name: data.data.team[0].Club.name,
            team_a_score: data.data.team[0].goal_score,
            team_b_name: data.data.team[1].Club.name,
            team_b_score: data.data.team[1].goal_score,
            title: this.type == 3 ? "Upcoming Matches" : this.type == 1 ? "Hero Banner" : this.type == 4 ? "Full Match Replays": '',
            sub_title: data.data.team[0].Club.name +' vs ' + data.data.team[1].Club.name,
            match_status: data.data.match?.status,
            sports_type: data.data.match?.sports_type,
            match_time_start: calculateLocalDateTime(data.data.match?.date),
            league_name: data.data.match?.League.name,
            team_a: data.data.team[0].Club.image,
            duration: data.data.match?.played_in_minute

          })
           
            this.cdr.detectChanges();
          
      })
      } else {
        this.addItem.reset(); // Reset form if no match selected
      }
    }
   
  }
    onInsert(objValue:any){
     this.isLoading$.next(true);
     this.services.addHomeItem(objValue)
       .pipe(first())
       .subscribe(
         data => {
          //  console.log(data);
           if (data && data.success==true) {
            //  this.isLoading$.next(false);
            //  this.cdr.detectChanges();
            //  this.addItem.reset();
             this.toastr.success('Match Video Added successfully', 'Add Match Video',{
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

   

   ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.type = this.route.snapshot.paramMap.get('type');

    this.loadMatchDetails()
   }
  loadMatchDetails() {
    this.http.get(`${environment.apiUrl}/admin/matches`).subscribe((data: any) => {
      this.matchList = data.data
        this.cdr.detectChanges();
      
  })
      
}

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  closemodal(){
    this.addItem.reset();
  }
}
