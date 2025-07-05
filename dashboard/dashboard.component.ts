import { HttpClient } from '@angular/common/http';
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard';
import { environment } from 'src/environments/environment';
import {AuthService, UserType} from "../../modules/auth";
import {User} from "aws-sdk/clients/mq";
import {Router} from "@angular/router";
//import { ModalConfig, ModalComponent } from '../../_metronic/partials';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit{
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private router:Router,private auth:AuthService) {}
  dashboardData: any = null
  user$: Observable<UserType>;
  user:User|null = null;



  getDashboard() {
    this.http.get(`${environment.apiUrl}/userPurchaseStats`).subscribe(
      (response: any) => {
        this.dashboardData = response.data; 
        console.log(this.dashboardData)
        this.cdr.detectChanges()
      },
      (error) => {
        console.error("Error fetching dashboard data:", error);
      }
    );
  }
  topMatches:any = []
  getTopMatches() {
    this.http.get(`${environment.apiUrl}/popularMatches`).subscribe(
      (response: any) => {
        this.topMatches = response.data.topMatches; 
        this.cdr.detectChanges()
      },
      (error) => {
        console.error("Error fetching dashboard data:", error);
      }
    );
  }
  topVideos:any = []
  getTopVideos() {
    this.http.get(`${environment.apiUrl}/popularVideos`).subscribe(
      (response: any) => {
        this.topVideos = response.data.data; 
        this.cdr.detectChanges()
      },
      (error) => {
        console.error("Error fetching dashboard data:", error);
      }
    );
  }
  checkUser()
  {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.user$.subscribe(user => {
      if(user)
      {
        if(user.type == 4 || user.type==5)
        {
          this.router.navigate(['/game/matches']);
        }

      }
    },error => {
      if(error.status==401)
      {
        this.auth.logout();
      }
    });
  }

  ngOnInit(): void {
    this.checkUser();
    this.getDashboard();
    this.getTopMatches()
    this.getTopVideos()
  }
}
