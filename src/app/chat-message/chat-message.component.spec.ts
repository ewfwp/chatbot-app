import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChatMessageComponent } from './chat-message.component';

describe(ChatMessageComponent.name, () => {
  let fixture: ComponentFixture<ChatMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatMessageComponent);
  });

  it('should create', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});
