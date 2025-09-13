export enum ActivityType {
  Yoga = 'yoga',
  Diet = 'diet',
  Walking = 'walking',
}

export interface YogaClass {
  id: number;
  title: string;
  url: string;
}

export interface Recipe {
  name: string;
  category: 'Café da Manhã' | 'Almoço' | 'Lanche' | 'Jantar';
  ingredients: string[];
  instructions: string;
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface DailyProgress {
  yoga?: boolean;
  diet?: boolean;
  walkingMinutes?: number;
  completedYogaClasses?: number[];
}

export type ProgressData = Record<string, DailyProgress>;