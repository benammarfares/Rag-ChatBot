import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent {
  @Input() set pdfUrl(url: string | null) {
    if (url) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      this.safeUrl = null;
    }
  }

  safeUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}
}
