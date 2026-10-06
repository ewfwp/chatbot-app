import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { AppComponent } from './app.component';

describe(AppComponent.name, () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('shows an accessible welcome message and input', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[role="log"]')?.textContent).toContain(
      'Waarmee kan ik u helpen?',
    );
    expect(element.querySelector('label')?.textContent).toContain('Stel uw vraag');
    expect(element.querySelector('input')).not.toBeNull();
  });

  it('shows a calculator link after a calculation question', () => {
    const element = fixture.nativeElement as HTMLElement;
    const input = element.querySelector('input') as HTMLInputElement;
    const form = element.querySelector('form') as HTMLFormElement;

    input.value = 'Hoeveel kan ik lenen?';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    const action = Array.from(element.querySelectorAll<HTMLAnchorElement>('a')).find((link) =>
      link.textContent?.includes('Bereken uw hypotheek'),
    );

    expect(element.querySelector('[role="log"]')?.textContent).toContain('eerste indicatie');
    expect(action?.href).toBe('https://jwz-fd.nl/onze-calculator/');
  });
});
