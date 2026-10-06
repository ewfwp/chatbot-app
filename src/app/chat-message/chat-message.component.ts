import { Component, input, ViewEncapsulation } from '@angular/core';
import { ChatMessage } from '../chatbot.models';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.chat-message--assistant]': "message().author === 'assistant'",
    '[class.chat-message--user]': "message().author === 'user'",
  },
})
export class ChatMessageComponent {
  readonly message = input.required<ChatMessage>();
}
