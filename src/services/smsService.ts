
import { SmsMessage, Transaction } from '@/types';
import { parseTransactionFromSMS } from '@/utils/smsParser';

// Real SMS scanning function that would be used on a physical device
export async function scanSmsMessages(): Promise<Transaction[]> {
  try {
    // Check if we're on a native platform
    if (window.Capacitor?.isPluginAvailable('CapacitorSMSPlugin')) {
      console.log('Using native SMS plugin');
      const messages = await fetchRealSmsMessages();
      return processMessages(messages);
    } else {
      console.log('Using mock SMS data (not on a native device)');
      // Use realistic mock data for testing/demo
      return processMessages(getMockSmsMessages());
    }
  } catch (error) {
    console.error('Error scanning SMS:', error);
    throw new Error('Failed to scan SMS messages');
  }
}

// Function to fetch real SMS messages from device
async function fetchRealSmsMessages(): Promise<SmsMessage[]> {
  // This would use a real Capacitor SMS plugin in production
  // For now, it returns realistic mock data
  
  // Mock implementation - in a real app you would use a proper SMS plugin
  // e.g.: const result = await SMSPlugin.getMessages({ limit: 10 });
  console.log('Attempting to access device SMS messages');
  
  // Return realistic mock data for demo/presentation
  return getMockSmsMessages();
}

// Process SMS messages to extract transactions
function processMessages(messages: SmsMessage[]): Transaction[] {
  const transactions: Transaction[] = [];
  
  for (const message of messages) {
    const transaction = parseTransactionFromSMS(message);
    if (transaction) {
      transactions.push(transaction);
    }
  }
  
  return transactions;
}

// Realistic mock SMS messages that closely resemble actual bank SMS format
function getMockSmsMessages(): SmsMessage[] {
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  
  return [
    {
      id: '1',
      body: 'Your HDFC Bank Card xx1234 was used for Rs.449.00 at SWIGGY on 2023-07-15 12:40:20. Available balance: Rs.24,651.30',
      sender: 'HDFCBANK',
      timestamp: yesterday.toISOString()
    },
    {
      id: '2',
      body: 'Transaction alert: INR 1299.00 debited from your SBI account xx5678 for payment to AMAZON INDIA on 2023-07-15. Balance: INR 8,752.45',
      sender: 'SBIBANK',
      timestamp: currentDate.toISOString()
    },
    {
      id: '3',
      body: 'Rs.45.00 has been debited from your ICICI Bank account xx9012 towards UPI payment on 2023-07-16. UPI Ref: 123456789012. Balance: Rs.15,302.75',
      sender: 'ICICIBNK',
      timestamp: currentDate.toISOString()
    },
    {
      id: '4',
      body: 'Your AXIS Bank Card has been charged Rs.2100.00 at UBER on 2023-07-17. Ref No. AX123456. Available balance: Rs.10,546.80',
      sender: 'AXISBNK',
      timestamp: currentDate.toISOString()
    },
    {
      id: '5',
      body: 'Rs.599.00 debited from your account for NETFLIX SUBSCRIPTION on 2023-07-17. - KOTAK BANK',
      sender: 'KOTAKBNK',
      timestamp: currentDate.toISOString()
    }
  ];
}
