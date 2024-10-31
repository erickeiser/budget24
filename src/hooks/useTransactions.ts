import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc,
  updateDoc,
  doc, 
  serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Transaction } from '../types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newTransactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate?.() || new Date(),
        })) as Transaction[];
        setTransactions(newTransactions);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Firestore error:', error);
        setError(handleFirestoreError(error));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    if (!user) {
      setError('You must be logged in to add transactions');
      return;
    }

    try {
      await addDoc(collection(db, 'transactions'), {
        ...transaction,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Add transaction error:', error);
      setError(handleFirestoreError(error));
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Omit<Transaction, 'id' | 'date'>>) => {
    if (!user) {
      setError('You must be logged in to update transactions');
      return;
    }

    try {
      const docRef = doc(db, 'transactions', id);
      await updateDoc(docRef, updates);
    } catch (error) {
      setError(handleFirestoreError(error));
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) {
      setError('You must be logged in to delete transactions');
      return;
    }

    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      setError(handleFirestoreError(error));
      throw error;
    }
  };

  return {
    transactions,
    error,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
}