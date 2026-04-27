export type TranslationId = 'dra' | 'web' | 'kjv';

export interface BibleBook {
  id: string;
  name: string;
  apiName: string;
  chapters: number;
  testament: 'old' | 'new';
  isDeutorocanonical?: boolean;
}

export interface ScripturePassage {
  reference: string;
  text: string;
  verses: { book_id: string; book_name: string; chapter: number; verse: number; text: string }[];
}

export interface ActionIntention {
  id: string;
  text: string;
  completed: boolean;
}

export interface Session {
  id: string;
  createdAt: string;
  dateCompleted?: string;
  scriptureRef: string;
  scriptureText: string;
  openingPrayerId: string;
  step3Text: string;
  step4Mind: string;
  step4Life: string;
  step4Heart: string;
  step6Text: string;
  intentions: ActionIntention[];
  isFavourite: boolean;
  tags: string[];
  currentStep: number;
  isCompleted: boolean;
}

export interface UserProfile {
  id: string;
  displayName: string;
  reminderTime?: string;
  preferredTranslation: TranslationId;
  createdAt: string;
}
