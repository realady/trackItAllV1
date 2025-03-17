
import { Transaction } from '@/types';

// LocalStorage keys
const STORAGE_KEYS = {
  TRANSACTIONS: 'tracitall-transactions',
};

// Save transactions to localStorage
export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

// Get transactions from localStorage
export const getTransactions = (): Transaction[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    return [];
  }
};

// Add a new transaction
export const addTransaction = (transaction: Transaction): Transaction[] => {
  const transactions = getTransactions();
  const updatedTransactions = [...transactions, transaction];
  saveTransactions(updatedTransactions);
  return updatedTransactions;
};

// Update a transaction
export const updateTransaction = (updatedTransaction: Transaction): Transaction[] => {
  const transactions = getTransactions();
  const updatedTransactions = transactions.map(transaction => 
    transaction.id === updatedTransaction.id ? updatedTransaction : transaction
  );
  saveTransactions(updatedTransactions);
  return updatedTransactions;
};

// Delete a transaction
export const deleteTransaction = (id: string): Transaction[] => {
  const transactions = getTransactions();
  const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
  saveTransactions(updatedTransactions);
  return updatedTransactions;
};

// Mark SMS transactions as processed
export const markTransactionsAsProcessed = (transactions: Transaction[]): Transaction[] => {
  const allTransactions = getTransactions();
  const updatedTransactions = allTransactions.map(transaction => {
    const matchedTransaction = transactions.find(t => t.id === transaction.id);
    if (matchedTransaction) {
      return { ...transaction, processed: true };
    }
    return transaction;
  });
  saveTransactions(updatedTransactions);
  return updatedTransactions;
};
