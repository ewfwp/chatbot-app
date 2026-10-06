import { Injectable } from '@angular/core';

import { CHATBOT_KNOWLEDGE, EMPTY_QUESTION_REPLY, FALLBACK_REPLY } from './data/chatbot-knowledge';
import type { ChatbotKnowledgeItem, ChatbotReply } from './chatbot.models';

const MINIMUM_MATCH_SCORE = 4;

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  answer(question: string): ChatbotReply {
    const normalizedQuestion = this.normalize(question);

    if (!normalizedQuestion) {
      return EMPTY_QUESTION_REPLY;
    }

    const bestMatch = CHATBOT_KNOWLEDGE.reduce<{
      item: ChatbotKnowledgeItem | undefined;
      score: number;
    }>(
      (currentBest, item) => {
        const score = this.score(normalizedQuestion, item);
        return score > currentBest.score ? { item, score } : currentBest;
      },
      { item: undefined, score: 0 },
    );

    return bestMatch.item && bestMatch.score >= MINIMUM_MATCH_SCORE
      ? bestMatch.item
      : FALLBACK_REPLY;
  }

  private score(question: string, item: ChatbotKnowledgeItem): number {
    const questionTokens = new Set(question.split(' '));

    const phraseScore = Math.max(
      0,
      ...item.phrases.map((phrase) => {
        const normalizedPhrase = this.normalize(phrase);
        const phraseTokens = normalizedPhrase.split(' ');

        if (question === normalizedPhrase) {
          return 20 + phraseTokens.length;
        }

        if (phraseTokens.length === 1 && questionTokens.has(normalizedPhrase)) {
          return 12 + phraseTokens.length;
        }

        if (phraseTokens.length > 1 && question.includes(normalizedPhrase)) {
          return 12 + phraseTokens.length;
        }

        const matchingTokens = phraseTokens.filter((token) => questionTokens.has(token)).length;
        return phraseTokens.length > 1 && matchingTokens === phraseTokens.length
          ? matchingTokens * 2
          : 0;
      }),
    );

    const keywordScore = item.keywords.reduce((score, keyword) => {
      const normalizedKeyword = this.normalize(keyword);
      const matches = normalizedKeyword.includes(' ')
        ? question.includes(normalizedKeyword)
        : questionTokens.has(normalizedKeyword);

      return matches ? score + (normalizedKeyword.includes(' ') ? 3 : 2) : score;
    }, 0);

    return phraseScore + keywordScore;
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('nl-NL')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
