
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupabaseStore } from '@/store/supabaseStore';
import { TransactionModal } from './TransactionModal';
import { format, parseISO } from 'date-fns';
import { Edit, Trash2, Plus } from 'lucide-react';

export const Transactions = () => {
  const { transactions, deleteTransaction, categories, loading } = useSupabaseStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState(null);

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, typeof transactions>);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#6b7280';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <div className="mt-4">
          <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedDates.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 text-lg">No transactions yet</p>
              <p className="text-gray-400">Add your first transaction to get started</p>
            </CardContent>
          </Card>
        ) : (
          sortedDates.map((date) => {
            const dayTransactions = groupedTransactions[date];
            const dayTotal = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
            
            return (
              <Card key={date}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex flex-col space-y-2">
                    <span>{format(parseISO(date), 'EEE, MMMM d, yyyy')}</span>
                    <span className={`font-bold ${dayTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(dayTotal).toFixed(2)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dayTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div
                          className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0"
                          style={{ backgroundColor: getCategoryColor(transaction.category) }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{transaction.category}</p>
                          {transaction.notes && (
                            <p className="text-sm text-gray-600 break-words">{transaction.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`font-bold text-sm sm:text-base ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(transaction)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(transaction.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        transaction={editingTransaction}
      />
    </div>
  );
};