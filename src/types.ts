export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Category {
  id: string;
  name: string;
  budget: number;
  color: string;
}