import { useState } from 'react';
import { Pencil, Trash2, X, Check } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import type { Transaction } from '../types';
import { useTransactions } from '../hooks/useTransactions';

interface TransactionListProps {
  transactions: Transaction[];
  type: 'income' | 'expense';
  totalIncome: number;
  categories: readonly string[];
}

export default function TransactionList({ transactions, type, totalIncome, categories }: TransactionListProps) {
  const { updateTransaction, deleteTransaction } = useTransactions();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    amount: '',
    category: '',
    description: ''
  });

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      amount: Math.abs(transaction.amount).toString(),
      category: transaction.category,
      description: transaction.description || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ amount: '', category: '', description: '' });
  };

  const handleUpdate = async (id: string) => {
    try {
      const updates = {
        amount: type === 'expense' ? -Math.abs(Number(editForm.amount)) : Math.abs(Number(editForm.amount)),
        category: editForm.category,
        description: editForm.description.trim()
      };
      await updateTransaction(id, updates);
      cancelEdit();
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 capitalize">{type}s</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`p-4 rounded-lg ${
              type === 'income' ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            {editingId === transaction.id ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                  {type === 'expense' && (
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Description (optional)"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleUpdate(transaction.id)}
                    className="p-2 text-green-600 hover:text-green-700"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-2 text-gray-600 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium capitalize">{transaction.category}</p>
                  {transaction.description && (
                    <p className="text-sm text-gray-600">{transaction.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-bold ${
                      type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    {type === 'expense' && totalIncome > 0 && (
                      <p className="text-sm text-gray-500">
                        {((Math.abs(transaction.amount) / totalIncome) * 100).toFixed(1)}% of income
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(transaction)}
                      className="p-2 text-gray-600 hover:text-gray-700"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {transactions.length === 0 && (
          <p className="text-gray-500 text-center py-4">No {type}s recorded</p>
        )}
      </div>
    </div>
  );
}