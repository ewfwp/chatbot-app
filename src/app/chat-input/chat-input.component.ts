import { Component, computed, ElementRef, input, output, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { nonWhitespaceValidator } from './validators/non-whitespace.validator';

let nextInputId = 0;

@Component({
  selector: 'app-chat-input',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './chat-input.component.html',
})
export class ChatInputComponent {
  readonly describedBy = input('');
  readonly questionSubmitted = output<string>();

  private readonly instanceId = ++nextInputId;

  protected readonly inputId = `jwz-chatbot-question-${this.instanceId}`;
  protected readonly errorId = `jwz-chatbot-question-error-${this.instanceId}`;
  protected readonly questionInput =
    viewChild.required<ElementRef<HTMLInputElement>>('questionInput');
  protected readonly question = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(300), nonWhitespaceValidator],
  });
  protected readonly ariaDescribedBy = computed(() => {
    return [this.describedBy(), this.errorId].filter(Boolean).join(' ');
  });

  protected submit(): void {
    const question = this.question.value.trim();

    if (this.question.invalid || !question) {
      this.question.markAsTouched();
      return;
    }

    this.questionSubmitted.emit(question);
    this.question.reset();
    this.questionInput().nativeElement.focus();
  }
}
