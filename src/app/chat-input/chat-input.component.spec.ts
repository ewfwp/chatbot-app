import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChatInputComponent } from './chat-input.component';

describe(ChatInputComponent.name, () => {
  let fixture: ComponentFixture<ChatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatInputComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('prevents native navigation and emits a trimmed question', () => {
    const element = fixture.nativeElement as HTMLElement;
    const input = element.querySelector('input') as HTMLInputElement;
    const form = element.querySelector('form') as HTMLFormElement;
    const submitted = vi.fn();

    fixture.componentInstance.questionSubmitted.subscribe(submitted);
    input.value = '  Hallo  ';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
    fixture.detectChanges();

    expect(submitEvent.defaultPrevented).toBe(true);
    expect(submitted).toHaveBeenCalledWith('Hallo');
    expect(input.value).toBe('');
  });

  it('rejects whitespace-only questions', () => {
    const element = fixture.nativeElement as HTMLElement;
    const input = element.querySelector('input') as HTMLInputElement;
    const form = element.querySelector('form') as HTMLFormElement;
    const submitted = vi.fn();

    fixture.componentInstance.questionSubmitted.subscribe(submitted);
    input.value = '   ';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(submitted).not.toHaveBeenCalled();
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});
