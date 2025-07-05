import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private updateMatchURL = 'https://asia-south1-football-66554.cloudfunctions.net/updateMatch';
  private getMatchURL = 'https://asia-south1-football-66554.cloudfunctions.net/getMatchDetails';
  private matchEventURL = 'https://asia-south1-football-66554.cloudfunctions.net/updateMatchEvents';


  constructor(private http: HttpClient) { }

  // Function to write data to Firestore using the Cloud Function
  writeToFirestore(data: any): Observable<any> {
    // Call the Cloud Function with the data to be written to Firestore
    return this.http.post(this.updateMatchURL, data);
  }
  updateMatchEvent(data:any): Observable<any> {
    // Call the Cloud Function with the match event data to be written to Firestore
    return this.http.post(this.matchEventURL, data);
  }

  getMatchDetails(id: number): Observable<any> {
    // Call the Cloud Function with the data to be written to Firestore
    const data ={id:id};
    return this.http.post(this.getMatchURL, data);
  }
}
