
import { SmsMessage, Transaction } from '@/types';

// Regular expressions for detecting transaction information in SMS
const AMOUNT_REGEX = /(?:RS|INR|Rs|₹)\.?\s*(\d+(?:[,.]\d+)*)/i;
const CARD_REGEX = /(?:card|credit card|debit card|cc|dc|crd)/i;
const DEBIT_REGEX = /(?:debited|spent|paid|payment|debit|charged|purchasing|purchase)/i;
const INFO_REGEX = /(?:at|to|in|for)\s+([A-Za-z0-9\s&.]+)/i;
const DATE_REGEX = /(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})/i;

export function parseTransactionFromSMS(message: SmsMessage): Transaction | null {
  const { body, timestamp } = message;
  
  // Check if message is likely to be a transaction
  if (!isTransactionSMS(body)) {
    return null;
  }
  
  // Extract amount
  const amountMatch = body.match(AMOUNT_REGEX);
  if (!amountMatch) return null;
  
  // Clean amount string and convert to number
  let amountStr = amountMatch[1].replace(/,/g, '');
  // Handle both international and decimal formats (1,234.56 or 1.234,56)
  if (amountStr.includes('.')) {
    amountStr = amountStr.replace(/\./g, '');
    if (amountStr.includes(',')) {
      amountStr = amountStr.replace(',', '.');  // Convert European format to standard
    }
  } else if (amountStr.includes(',')) {
    amountStr = amountStr.replace(',', '.');
  }
  
  const amount = parseFloat(amountStr);
  
  // Extract description/merchant
  let description = 'Unknown merchant';
  const infoMatch = body.match(INFO_REGEX);
  if (infoMatch && infoMatch[1]) {
    description = infoMatch[1].trim();
  } else {
    // Try to extract merchant name from the message body
    const merchantKeywords = [
      'SWIGGY', 'ZOMATO', 'AMAZON', 'FLIPKART', 'NETFLIX', 'UBER', 'OLA',
      'PHONEPE', 'PAYTM', 'GPAY', 'GOOGLE PAY', 'MYNTRA', 'AJIO'
    ];
    
    for (const keyword of merchantKeywords) {
      if (body.toUpperCase().includes(keyword)) {
        description = keyword;
        break;
      }
    }
  }
  
  // Determine category based on keywords (basic implementation)
  const category = determineCategory(description, body);
  
  return {
    id: `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    amount: amount,
    description: description,
    date: new Date(timestamp).toISOString(),
    category: category,
    source: 'sms',
    processed: false
  };
}

// Helper function to determine if an SMS is likely a transaction notification
function isTransactionSMS(body: string): boolean {
  // More comprehensive check for bank transaction messages
  const bankKeywords = ['bank', 'hdfc', 'sbi', 'icici', 'axis', 'kotak', 'statement', 'transaction', 'account'];
  const hasBank = bankKeywords.some(keyword => body.toLowerCase().includes(keyword));
  
  // Check for common transaction-related keywords
  return (
    hasBank && 
    (CARD_REGEX.test(body) || DEBIT_REGEX.test(body)) &&
    AMOUNT_REGEX.test(body)
  );
}

// Improved category determination based on keywords
function determineCategory(merchant: string, fullText: string): string {
  const lowerText = (merchant + ' ' + fullText).toLowerCase();
  
  if (/swiggy|zomato|restaurant|food|pizza|burger|cafe|dining|eat|breakfast|lunch|dinner|meal/i.test(lowerText)) {
    return 'food';
  } else if (/amazon|flipkart|myntra|ajio|grocery|market|supermarket|mart|store|shop/i.test(lowerText)) {
    return 'shopping';
  } else if (/uber|ola|cab|taxi|train|bus|metro|transport|flight|airline/i.test(lowerText)) {
    return 'transportation';
  } else if (/netflix|prime|hotstar|movie|cinema|theatre|spotify|entertainment/i.test(lowerText)) {
    return 'entertainment';
  } else if (/bill|electricity|water|gas|utility|phone|mobile|broadband|internet/i.test(lowerText)) {
    return 'utilities';
  } else if (/hospital|doctor|medical|medicine|pharmacy|health/i.test(lowerText)) {
    return 'health';
  } else if (/school|college|university|course|tuition|education|book/i.test(lowerText)) {
    return 'education';
  } else {
    return 'other';
  }
}
