import { Component, input } from '@angular/core';
import { ChatMessage } from '../chatbot.models';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
})
export class ChatMessageComponent {
  readonly message = input.required<ChatMessage>();
}
