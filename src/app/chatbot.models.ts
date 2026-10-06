export type ChatMessageAuthor = 'assistant' | 'user';

export type ChatbotTopic =
  | 'greeting'
  | 'mortgage-calculation'
  | 'mortgage-definition'
  | 'mortgage-types'
  | 'mortgage-interest'
  | 'mortgage-costs'
  | 'nhg'
  | 'starters'
  | 'change-mortgage'
  | 'insurance'
  | 'comparison-card'
  | 'about-jwz'
  | 'contact'
  | 'privacy'
  | 'fallback';

export type ChatbotActionDefinition = {
  readonly label: string;
  readonly path: string;
};

export type ChatbotReply = {
  readonly topic: ChatbotTopic;
  readonly text: string;
  readonly action?: ChatbotActionDefinition;
};

export type ChatbotKnowledgeItem = {
  readonly phrases: readonly string[];
  readonly keywords: readonly string[];
} & ChatbotReply;

export type ChatMessageAction = {
  readonly label: string;
  readonly href: string;
};

export type ChatMessage = {
  readonly id: string;
  readonly author: ChatMessageAuthor;
  readonly text: string;
  readonly action?: ChatMessageAction;
};
