import { Component, ElementRef, output, signal, viewChild } from '@angular/core';
import { form, FormField, maxLength, required, validate } from '@angular/forms/signals';
import { nonWhitespaceValidator } from './validators/non-whitespace.validator';

@Component({
  selector: 'app-chat-input',
  imports: [FormField],
  templateUrl: './chat-input.component.html',
})
export class ChatInputComponent {
  readonly questionSubmitted = output<string>();

  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  protected readonly question = form(signal(''), (path) => {
    required(path);
    maxLength(path, 300);
    validate(path, nonWhitespaceValidator);
  });

  protected submit(event: Event): void {
    event.preventDefault();
    const question = this.question().value().trim();

    this.questionSubmitted.emit(question);
    this.question().reset('');
    this.input().nativeElement.focus();
  }
}
