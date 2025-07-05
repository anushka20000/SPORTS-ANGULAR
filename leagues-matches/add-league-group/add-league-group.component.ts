import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {generateUniqueName, getCDNImage, getPrefix} from "../../../modules/utilities/file";
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {checkFileSize, resizeImage} from "../../../modules/utilities/imageSize";
import {UploadService} from "../../../services/upload.service";
import { LeagueService } from 'src/app/services/league.service';

@Component({
  selector: 'app-add-league-group',
  templateUrl: './add-league-group.component.html',
  styleUrls: ['../leagues.scss']
})
export class AddLeagueGroupComponent implements OnInit, OnDestroy {
  @Output() OnAddForm = new EventEmitter<any>();
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  leagueForm: FormGroup;
  states:any;
  cities:any;
  squareFile?: File;
  squareProgress:number = 0;
  square_image_path = "";

  constructor(private cdr: ChangeDetectorRef, private service:LeagueService, private uploadService:UploadService,
    private router:Router,private fb: FormBuilder, private toastr:ToastrService) {
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
    this.leagueForm = this.fb.group({
      league_id: ['', Validators.required],     
      group_id: ['', Validators.required],        
      teamA_id: ['', Validators.required], 
    });
  }

  onInsert(objValue:any){
     this.isLoading$.next(true);
   
     this.service.addLeagueGroup(objValue)
       .pipe(first())
       .subscribe(
         data => {
           console.log(data);
           if (data && data.success==true) {
             this.isLoading$.next(false);
             this.cdr.detectChanges();
             this.leagueForm.reset();
             this.toastr.success('League Added successfully', 'Add League Group CLub',{
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
             this.toastr.error("Student creation process failed.", 'Add League Group CLub',{
               timeOut: 3000,
               progressBar:true,
               tapToDismiss:true,
               toastClass: 'flat-toast ngx-toastr'
             });

            this.cdr.detectChanges();
           }
         },
         error => {
           this.toastr.error("Internal server error, Please try again after sometime.", 'Add League Group CLub',{
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
             this.leagues = data;
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
     this.onTeamInit();
   } else {
     this.teams = []; // Clear teams if no league is selected
   }
 }
 onTeamInit() {
   this.service.getClubs()
     .pipe(first())
     .subscribe(
       (data:any) => {
         if (data) {
           this.teams = data.clubs;
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
     this.onGroupInit();
     // this.onTeamInit();
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
    this.leagueForm.reset();
  }
}
