import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { Summary } from './Summary';
import { AddTransaction } from './AddTransaction';
import TransactionList from './TransactionList';
import type { Transaction } from '../types';

const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Other'
] as const;

export default function Dashboard() {
  const { logout } = useAuth();
  const { transactions, addTransaction, error } = useTransactions();
  const [isAdding, setIsAdding] = useState(false);

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    setIsAdding(true);
    try {
      await addTransaction(transaction);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Budget Dashboard</h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <Summary transactions={transactions} />

        <div className="mt-8">
          <AddTransaction
            onAdd={handleAddTransaction}
            categories={EXPENSE_CATEGORIES}
            isAdding={isAdding}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <TransactionList
            transactions={transactions.filter(t => t.type === 'income')}
            type="income"
            totalIncome={income}
            categories={EXPENSE_CATEGORIES}
          />
          <TransactionList
            transactions={transactions.filter(t => t.type === 'expense')}
            type="expense"
            totalIncome={income}
            categories={EXPENSE_CATEGORIES}
          />
        </div>
      </div>
    </div>
  );
}