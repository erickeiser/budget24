import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface AddTransactionProps {
  onAdd: (transaction: any) => Promise<void>;
  categories: string[];
  isAdding: boolean;
}

export function AddTransaction({ onAdd, categories, isAdding }: AddTransactionProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isAdding) return;

    const transaction = {
      amount: type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
      category: type === 'income' ? 'Income' : category,
      description: description.trim(),
      type
    };

    try {
      await onAdd(transaction);
      // Reset form
      setAmount('');
      setCategory(categories[0]);
      setDescription('');
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <button
                  type="button"
                  onClick={() => setType(type === 'income' ? 'expense' : 'income')}
                  className={`h-full px-3 border-r ${
                    type === 'income' 
                      ? 'text-green-600 hover:text-green-700' 
                      : 'text-red-600 hover:text-red-700'
                  }`}
                >
                  {type === 'income' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                </button>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full pl-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          {type === 'expense' && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter description"
          />
        </div>

        <button
          type="submit"
          disabled={isAdding || !amount}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {isAdding ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
}