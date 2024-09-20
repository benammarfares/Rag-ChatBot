import { Component, ChangeDetectorRef  } from "@angular/core";
import {
  Message,
  User,
  SendMessageEvent,
} from "@progress/kendo-angular-conversational-ui";
import { HttpClient } from "@angular/common/http";


@Component({
  selector: "app-rag-chat",
  templateUrl: './rag-chat.component.html',
  styleUrls: ['./rag-chat.component.css'],
})
export class RagChatComponent {
  public user: User = { id: 1 };

  public bot: User = { id: 0 };

  public textareaMessages: Message[] = [
    {
      author: this.bot,
      text: ` Hello, Ask me any question about your documents!.`,
    },


  ];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  public sendTextareaMessages(e: SendMessageEvent): void {
    this.textareaMessages = [...this.textareaMessages, e.message];

    this.http.get(`http://localhost:9292/q?message=${encodeURIComponent(e.message.text!)}`, { responseType: 'text' })
      .subscribe({
        next: (response: any) => {
          const botReply: Message = {
            author: this.bot,
            text: response
          };
          console.log('Bot reply:', botReply);
          this.textareaMessages = [...this.textareaMessages, botReply];
          console.log('Updated textareaMessages:', this.textareaMessages);  // Log the updated messages array

        },
        error: (error) => {
          console.error('Error calling backend:', error);
        }
      });
  }


}
