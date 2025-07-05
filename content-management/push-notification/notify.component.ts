import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {checkFileSize, resizeImage} from "../../../modules/utilities/imageSize";
import {ToastrService} from "ngx-toastr";
import { UploadService } from 'src/app/services/upload.service';
import {generateUniqueName, getCDNImage, getPrefix} from "../../../modules/utilities/file";
@Component({
  selector: 'app-push-notification',
  templateUrl: './notify.component.html',
})
export class NotifyComponent {
  pushNotificationForm: FormGroup;
  isLoading = false;
  imageUrl: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private toastr:ToastrService, private uploadService:UploadService, private cdr: ChangeDetectorRef) {
    this.pushNotificationForm = this.fb.group({
      topic: ['ssen_prod_all', Validators.required],
      // topic: ['ssen_test', Validators.required],
      title: ['', Validators.required],
      message: ['', Validators.required],
      image: [''],
    });
  }

  selectedImageFile: File | null = null;
  squareFile?: File;
  squareProgress:number = 0;
  square_image_path = "";
  
//   checkBeforeUpload(file:File, type:number, minWidth:number,minHeight:number,
//     maxWidth:number,maxHeight:number,ratio:number,callBack:any) {
// checkFileSize(file).then((value: any) => {
// if (value.width && value.height) {
// const expectedWidth = value.height * ratio;
// // check if absolute difference between width and expected width is less than 10%
// if (Math.abs(value.width - expectedWidth) > value.width * 0.1) {
// this.toastr.error("Image must be of correct aspect ratio");
// callBack();
// return;
// }
// if (value.width < minWidth || value.height < minHeight) {
// this.toastr.error("Image size must be at least " + minWidth + "x" + minHeight + " pixels");
// callBack();
// return;
// }

// // console.log(event.addedFiles[0]);
// resizeImage(file, maxWidth, maxHeight).then((newFile: File | null) => {
// if (newFile !== null) {
// // console.log(newFile);

// this.handleUpload(newFile, type);
// } else {
// this.toastr.error("Error optimizing image before upload.");
// callBack();
// }
// });

// } else {
// this.toastr.error("Unable to parse image size, the image may be corrupted.");
// }
// });
// }
onSelectSquare(event:any) {
this.squareFile = event.addedFiles[0];
if(this.squareFile)
this.handleUpload(this.squareFile, 1);

// this.checkBeforeUpload(this.squareFile,1,256,256,500,500,1,
// ()=>{this.onRemoveSquare(event)});

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
  sendNotification(): void {
    if (this.pushNotificationForm.valid) {
      this.isLoading = true;
      this.pushNotificationForm.value.image = this.square_image_path
      const payload = this.pushNotificationForm.value;

      this.http
        .post(
          'https://asia-south1-football-66554.cloudfunctions.net/sendNotificationTopic',
          payload,
          {
            headers: {
              Authorization: `Bearer YOUR_AUTH_TOKEN`, // Replace with actual token
            },
          }
        )
        .subscribe({
          next: () => {
            this.isLoading = false;
            alert('Notification sent successfully!');
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error sending notification:', err);
            alert('Failed to send notification.');
          },
        });
    }
  }
}
