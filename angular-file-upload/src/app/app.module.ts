import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { UploadsModule } from "@progress/kendo-angular-upload";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { SingleFileUploadComponent } from './single-file-upload/single-file-upload.component';
import { RagChatComponent } from './rag-chat/rag-chat.component';
import { ConversationalUIModule } from '@progress/kendo-angular-conversational-ui';
import { ChatModule } from "@progress/kendo-angular-conversational-ui";




@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    PdfViewerComponent,
    SingleFileUploadComponent,
    RagChatComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    UploadsModule,
    CommonModule,
    ConversationalUIModule,
    ChatModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
