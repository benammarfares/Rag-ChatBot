import { Component } from "@angular/core";
import { HttpClient, HttpEventType, HttpErrorResponse } from "@angular/common/http";
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: "app-single-file-upload",
  templateUrl: "./single-file-upload.component.html",
  styleUrls: ["./single-file-upload.component.css"],
})
export class SingleFileUploadComponent {
  status: "initial" | "uploading" | "success" | "fail" = "initial";
  file: File | null = null;
  uploadProgress: number = 0;
  errorMessage: string = '';
  MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
  pdfUrl: string | null = null;

  constructor(private http: HttpClient) {}




  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.status = "initial";
      this.file = file;
      this.errorMessage = '';
      if (file.size > this.MAX_FILE_SIZE) {
        this.errorMessage = `File size exceeds the maximum limit of 10MB. Your file size: ${this.formatFileSize(file.size)}`;
        this.status = "fail";
      }
      if (this.file) {
        this.pdfUrl = URL.createObjectURL(this.file);
      }
    }
  }

  onUpload(): void {
    if (this.file && this.file.size <= this.MAX_FILE_SIZE) {
      const formData = new FormData();
      formData.append('file', this.file, this.file.name);

      this.status = 'uploading';
      this.uploadProgress = 0;
      this.errorMessage = '';

      this.http.post('http://localhost:9292/upload', formData, {
        reportProgress: true,
        observe: 'events',
        responseType: 'text'
      }).pipe(
        map(event => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.uploadProgress = Math.round(100 * (event.loaded / (event.total || this.file!.size)));
              return { status: 'progress', message: this.uploadProgress };
            case HttpEventType.Response:
              console.log('Raw server response:', event.body);
              if (event.status === 200) {
                return { status: 'success', message: 'File uploaded successfully' };
              } else {
                throw new Error(`Server returned status code ${event.status}`);
              }
            default:
              return { status: 'default', message: `Unknown event: ${event.type}` };
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error details:', error);
          let errorMsg = 'Unknown error occurred';
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMsg = `Error: ${error.error.message}`;
          } else {
            errorMsg = `Error Code: ${error.status}\nMessage: ${error.message}`;
            if (error.status === 413) {
              errorMsg = `File size exceeds the maximum limit of 10MB.`;
            }
          }
          this.errorMessage = errorMsg;
          return of({ status: 'fail', message: errorMsg });
        })
      ).subscribe(
        (result: any) => {
          if (result.status === 'progress') {
            console.log(`Upload progress: ${result.message}%`);
          } else if (result.status === 'success') {
            console.log(result.message);
            this.status = 'success';
          } else if (result.status === 'fail') {
            console.error(result.message);
            this.status = 'fail';
          }
        }
      );
    }
  }

  formatFileSize(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
