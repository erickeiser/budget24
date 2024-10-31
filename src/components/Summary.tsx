import React from 'react';
import { DollarSign, TrendingDown, TrendingUp, Percent } from 'lucide-react';
import type { Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';

interface SummaryProps {
  transactions: Transaction[];
}

export function Summary({ transactions }: SummaryProps) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = income - expenses;
  const expensePercentage = income > 0 ? (expenses / income) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Income</p>
            <p className="text-2xl font-semibold text-green-600">{formatCurrency(income)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-full">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Expenses</p>
            <p className="text-2xl font-semibold text-red-600">{formatCurrency(expenses)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Balance</p>
            <p className="text-2xl font-semibold text-blue-600">{formatCurrency(balance)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <Percent className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Expense Ratio</p>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-semibold text-purple-600">
                {expensePercentage.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">of income</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}