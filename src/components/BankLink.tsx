import React, { useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Link } from 'lucide-react';
import type { Transaction } from '../types';

interface BankLinkProps {
  onTransactionsReceived: (transactions: Omit<Transaction, 'id'>[]) => void;
}

export function BankLink({ onTransactionsReceived }: BankLinkProps) {
  const onSuccess = useCallback(async (public_token: string) => {
    try {
      // Exchange public token for access token (needs backend implementation)
      const response = await fetch('/api/plaid/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token }),
      });
      
      if (!response.ok) throw new Error('Failed to exchange token');
      
      // Fetch transactions (needs backend implementation)
      const transactionsResponse = await fetch('/api/plaid/transactions');
      const transactions = await transactionsResponse.json();
      
      // Convert Plaid transactions to app format
      const formattedTransactions = transactions.map((t: any) => ({
        amount: t.amount,
        description: t.name,
        category: t.category[0] || 'Other',
        date: t.date,
        type: t.amount < 0 ? 'expense' : 'income',
      }));
      
      onTransactionsReceived(formattedTransactions);
    } catch (error) {
      console.error('Error linking bank account:', error);
      alert('Failed to link bank account. Please try again.');
    }
  }, [onTransactionsReceived]);

  const config = {
    token: null, // Get from your backend
    onSuccess,
    env: 'sandbox',
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
    >
      <Link className="w-4 h-4" />
      Connect Bank Account
    </button>
  );
}