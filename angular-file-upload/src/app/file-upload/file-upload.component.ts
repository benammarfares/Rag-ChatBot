import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  pdfUrl: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
    if (this.selectedFile) {
      this.pdfUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  onUpload(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.http.post('http://localhost:9292/upload', formData)
        .subscribe(
          (response) => {
            console.log('File uploaded successfully');
            // You can add more logic here, such as displaying a success message
          },
          (error) => {
            console.error('Error uploading file', error);
            // You can add error handling logic here
          }
        );
    }
  }
}
