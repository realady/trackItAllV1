
import { useState, useEffect } from 'react';
import { PlusCircle, List, RefreshCcw, ReceiptText, MessageSquareText, PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Transaction } from '@/types';
import { TransactionItem } from '@/components/TransactionItem';
import { EmptyState } from '@/components/EmptyState';
import { AddTransactionSheet } from '@/components/AddTransactionSheet';
import { 
  getTransactions, 
  addTransaction, 
  markTransactionsAsProcessed,
  deleteTransaction
} from '@/utils/storage';
import { scanSmsMessages } from '@/services/smsService';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isLoadingSMS, setIsLoadingSMS] = useState(false);
  
  // Load transactions on mount
  useEffect(() => {
    const storedTransactions = getTransactions();
    setTransactions(storedTransactions);
  }, []);

  // Function to handle SMS scanning
  const handleScanSMS = async () => {
    setIsLoadingSMS(true);
    
    try {
      toast.info("Scanning SMS messages...");
      
      // Use our SMS service to scan for transaction messages
      const foundTransactions = await scanSmsMessages();
      
      if (foundTransactions.length > 0) {
        let updatedTransactions = [...transactions];
        
        for (const transaction of foundTransactions) {
          updatedTransactions = addTransaction(transaction);
        }
        
        markTransactionsAsProcessed(foundTransactions);
        setTransactions(updatedTransactions);
        
        toast.success(`Found ${foundTransactions.length} transactions!`);
      } else {
        toast.info("No new transactions found in SMS");
      }
    } catch (error) {
      console.error('Error scanning SMS:', error);
      toast.error("Error scanning SMS messages");
    } finally {
      setIsLoadingSMS(false);
    }
  };

  // Handle adding a manual transaction
  const handleAddTransaction = (data: Omit<Transaction, 'id' | 'source' | 'processed'>) => {
    const newTransaction: Transaction = {
      id: `manual-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...data,
      source: 'manual',
      processed: true
    };
    
    const updatedTransactions = addTransaction(newTransaction);
    setTransactions(updatedTransactions);
  };
  
  // Handle removing a transaction
  const handleRemoveTransaction = (id: string) => {
    const updatedTransactions = deleteTransaction(id);
    setTransactions(updatedTransactions);
    toast.success("Transaction removed successfully");
  };

  // Calculate total expenses
  const totalExpenses = transactions.reduce((total, t) => total + t.amount, 0);

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Header */}
      <header className="p-3 sticky top-0 z-10 glass backdrop-blur-lg border-b">
        <div className="max-w-full mx-auto px-2">
          <h1 className="text-xl font-semibold mb-0.5">TraciTall</h1>
          <p className="text-sm text-muted-foreground">Track your expenses effortlessly</p>
        </div>
      </header>

      {/* Main Content - Added more top padding (pt-6) */}
      <main className="w-full mx-auto px-3 py-4 pt-6">
        {/* Summary Card */}
        <div className="glass p-4 rounded-xl mb-5 animate-in slide-up">
          <h2 className="text-muted-foreground mb-1 text-xs">Total Expenses</h2>
          <p className="text-2xl font-semibold mb-4">₹{totalExpenses.toFixed(2)}</p>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsAddingTransaction(true)}
              className="flex-1 press-effect text-xs"
              size="sm"
            >
              <PlusSquare className="mr-1 h-3 w-3" />
              Add Manually
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleScanSMS}
              className="flex-1 press-effect text-xs"
              size="sm"
              disabled={isLoadingSMS}
            >
              {isLoadingSMS ? (
                <RefreshCcw className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <MessageSquareText className="mr-1 h-3 w-3" />
              )}
              Scan SMS
            </Button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Transactions</h2>
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
              <List className="h-3 w-3 mr-1" />
              View All
            </Button>
          </div>

          <div className="animate-in fade-in">
            {transactions.length > 0 ? (
              <div className="space-y-2">
                {transactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((transaction) => (
                    <TransactionItem 
                      key={transaction.id} 
                      transaction={transaction}
                      onDelete={() => handleRemoveTransaction(transaction.id)}
                    />
                  ))}
              </div>
            ) : (
              <EmptyState
                title="No transactions yet"
                description="Add transactions manually or scan your SMS messages to get started."
                icon={<ReceiptText className="h-8 w-8 text-primary/40" />}
                className="py-8"
              />
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4">
        <Button 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-lg press-effect"
          onClick={() => setIsAddingTransaction(true)}
        >
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* Add Transaction Sheet */}
      <AddTransactionSheet
        open={isAddingTransaction}
        onOpenChange={setIsAddingTransaction}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
};

export default Index;
