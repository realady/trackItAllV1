
// Transaction Types
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  source: 'sms' | 'manual';
  processed: boolean;
}

// SMS Message Types
export interface SmsMessage {
  id: string;
  body: string;
  sender: string;
  timestamp: string;
}

// Transaction Category Types
export type Category = 
  | 'food'
  | 'shopping'
  | 'transportation'
  | 'entertainment'
  | 'utilities'
  | 'health'
  | 'education'
  | 'other';
