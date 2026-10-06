import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ChatbotService } from './chatbot.service';

describe(ChatbotService.name, () => {
  let service: ChatbotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatbotService);
  });

  it('answers a general mortgage question', () => {
    const reply = service.answer('Wat is een hypotheek?');

    expect(reply.topic).toBe('mortgage-definition');
    expect(reply.action?.path).toBe('/hypotheekadvies/');
  });

  it('sends calculation questions to the calculator', () => {
    const reply = service.answer('Hoe hoog is mijn hypotheek?');

    expect(reply.topic).toBe('mortgage-calculation');
    expect(reply.action?.path).toBe('/onze-calculator/');
  });

  it('recognizes questions regardless of capitals and punctuation', () => {
    const reply = service.answer('HOEVEEL kan ik lenen?!');

    expect(reply.topic).toBe('mortgage-calculation');
  });

  it('does not mistake hypotheekrente for a general mortgage question', () => {
    const reply = service.answer('Wat is de hypotheekrente?');

    expect(reply.topic).toBe('mortgage-interest');
  });

  it('recognizes a short calculator question', () => {
    const reply = service.answer('Hoeveel hypotheek?');

    expect(reply.topic).toBe('mortgage-calculation');
  });

  it('sends starter questions to the starter page', () => {
    const reply = service.answer('Ik wil mijn eerste huis kopen');

    expect(reply.topic).toBe('starters');
    expect(reply.action?.path).toBe('/starters/');
  });

  it('explains that messages remain local', () => {
    const reply = service.answer('Worden mijn gegevens opgeslagen?');

    expect(reply.topic).toBe('privacy');
    expect(reply.action).toBeUndefined();
  });

  it('uses contact as the safe fallback', () => {
    const reply = service.answer('Kunnen jullie mijn persoonlijke offerte beoordelen?');

    expect(reply.topic).toBe('fallback');
    expect(reply.action?.path).toBe('/contact/');
  });
});
