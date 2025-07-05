import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {checkFileSize, resizeImage} from "../../../modules/utilities/imageSize";
import {UploadService} from "../../../services/upload.service";
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { HomeService } from 'src/app/services/home.service';
@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['../content.scss']
})
export class AddItemComponent implements OnInit, OnDestroy {
  @Output() OnAddForm = new EventEmitter<any>();
  // @Output() OnEditForm = new EventEmitter<any>();

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  addItemForm!: FormGroup;
  showLeagueDropdown = false;
  showVideoCategoryDropdown = false;
  leagues = [{ id: 1, name: 'League 1' }, { id: 2, name: 'League 2' }]; // Example data
  videoCategories = [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];

  constructor(private cdr: ChangeDetectorRef, private services: HomeService, private uploadService:UploadService,
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
    this.addItemForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      league_id: [''],
      video_category_id: [''],
    });
   
  }
  
  getLeagues() {
    this.http.get(`${environment.apiUrl}/league-lists`).subscribe((data: any) => {
      this.leagues = data.data.data;
      console.log(this.leagues)
    });
  }
  getCategories() {
    this.http.get(`${environment.apiUrl}/video-categories`).subscribe((data: any) => {
      this.videoCategories = data.data;
      console.log(this.videoCategories)
    });
  }
  onTypeChange(e: any): void {
    const type = e.target.value
    this.showLeagueDropdown = ['2', '3', '4'].includes(type);
    this.showVideoCategoryDropdown = type === '7';

    if (!this.showLeagueDropdown) {
      this.addItemForm.get('league_id')?.setValue('');
    }
    if (!this.showVideoCategoryDropdown) {
      this.addItemForm.get('video_category_id')?.setValue('');
    }
  }

  onInsert(objValue:any){
     this.isLoading$.next(true);
    // return false;
     this.services.addItem(objValue)
       .pipe(first())
       .subscribe(
         data => {
           console.log(data);
           if (data && data.success==true) {
             this.isLoading$.next(false);
             this.cdr.detectChanges();
            
             this.toastr.success('Item Added successfully', 'Add Item',{
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
             this.toastr.error("Item creation process failed.", 'Add Item',{
               timeOut: 3000,
               progressBar:true,
               tapToDismiss:true,
               toastClass: 'flat-toast ngx-toastr'
             });

            this.cdr.detectChanges();
           }
         },
         error => {
           this.toastr.error("Internal server error, Please try again after sometime.", 'Add Item',{
             timeOut: 3000,
             progressBar:true,
             tapToDismiss:true,
             toastClass: 'flat-toast ngx-toastr'
           });
         });
   }


   ngOnInit(): void {
    this.getLeagues();
    this.getCategories();
   }



 
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
