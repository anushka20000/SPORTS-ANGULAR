import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {environment} from '../../environments/environment';
import * as AWS from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  protected baseURL = `${environment.apiUrl}`;



  private bucket = 'footballindiaprivate-new-shrachi';//'footballindiaprivate';
  private region = "ap-south-1";
  private identity_pool_id = "ap-south-1:9fd65f27-bf11-4e0b-8fa7-c1903a66502b";// "ap-south-1:5cf5185f-c691-449f-a8eb-1f8489851847";
  //"ap-south-1:c5f705a3-bb65-4793-9123-8f85f43dbbdf";

  constructor(private http: HttpClient) {
    AWS.config.region = this.region;
    AWS.config.signatureVersion = 'v4'
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: this.identity_pool_id,

    }, {
      region: this.region
    });
  }

  setBucket(bucket:string)
  {
    this.bucket = bucket;
  }

   public uploadFile(file: any, path: string, callback:any) {
     const s3 = new AWS.S3({
       useAccelerateEndpoint:true
     });
    let params:any = {
        Bucket: this.bucket,
        Key: path,
        Body: file
      };
    if(file.type.indexOf("image")!=-1)
      params['ContentType'] = file.type
    const upload = new AWS.S3.ManagedUpload({
      params: params,
      service:s3
    });


// show progress
    upload.on('httpUploadProgress', callback);
     const promise = upload.promise();
     return promise;
  }

  store(transObj: Object){
    return this.http.post<any>(this.baseURL+'/TransCodeResource', transObj)
      .pipe(map((res:any) => {
        return res;
        // login successful if there's a jwt token in the response
      }));
  }



}


