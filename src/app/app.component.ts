import { Component, inject, input, signal } from '@angular/core';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import type {
  ChatbotActionDefinition,
  ChatMessage,
  ChatMessageAction,
  ChatMessageAuthor,
} from './chatbot.models';
import { ChatbotService } from './chatbot.service';

@Component({
  selector: 'app-component',
  imports: [ChatInputComponent, ChatMessageComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly chatbotService = inject(ChatbotService);

  readonly heading = input('Vraag het de JWZ Hypotheekassistent');
  readonly siteUrl = input('https://jwz-fd.nl/');
  readonly primaryColor = input('#222356');
  readonly accentColor = input('#81b4de');

  protected readonly messages = signal<readonly ChatMessage[]>([
    this.createMessage(
      'assistant',
      'Hallo! Waarmee kan ik u helpen? Stel bijvoorbeeld een vraag over uw maximale hypotheek, starters of hypotheekvormen.',
    ),
  ]);

  protected askQuestion(question: string): void {
    const reply = this.chatbotService.answer(question);

    this.messages.update((messages) => [
      ...messages,
      this.createMessage('user', question),
      this.createMessage('assistant', reply.text, this.createAction(reply.action)),
    ]);
  }

  private createMessage(
    author: ChatMessageAuthor,
    text: string,
    action?: ChatMessageAction,
  ): ChatMessage {
    const message: ChatMessage = {
      id: ' asdf',
      author,
      text,
    };

    return action ? { ...message, action } : message;
  }

  private createAction(action: ChatbotActionDefinition | undefined): ChatMessageAction | undefined {
    if (!action) {
      return undefined;
    }

    try {
      return {
        label: action.label,
        href: new URL(action.path, this.siteUrl()).toString(),
      };
    } catch {
      return {
        label: action.label,
        href: action.path,
      };
    }
  }
}
