import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
import { Transaction } from '@/store/financeStore'; // Assuming this is your type definition
import { cn } from '@/lib/utils';

// Define a basic Transaction type if you don't have one
// export interface Transaction {
//   id: string;
//   date: string | Date;
//   amount: number;
//   type: 'income' | 'expense';
//   category: string;
//   notes?: string;
// }

interface TransactionCalendarProps {
  transactions: Transaction[];
}

export const TransactionCalendar = ({ transactions }: TransactionCalendarProps) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  // Get all transaction dates
  const transactionDates = transactions.map(t => new Date(t.date));

  // Get transactions for selected date
  const selectedDateTransactions = selectedDate
    ? transactions.filter(t => isSameDay(new Date(t.date), selectedDate))
    : [];

  // Calculate total for selected date
  const selectedDateTotal = selectedDateTransactions.reduce((sum, t) => {
    return sum + (t.type === 'income' ? t.amount : -Math.abs(t.amount));
  }, 0);

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        weekStartsOn={0} // Starts the week on Sunday
        className={cn("p-3 pointer-events-auto")}
        modifiers={{
          hasTransaction: transactionDates,
        }}
        modifiersStyles={{
          hasTransaction: {
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            borderRadius: '50%',
          },
        }}
      />

      {selectedDate && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-sm mb-3">
            Transactions for {format(selectedDate, 'PPP')}
          </h4>

          {selectedDateTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions on this date</p>
          ) : (
            <div className="space-y-2">
              <div className={`text-sm font-medium ${selectedDateTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Total: ${Math.abs(selectedDateTotal).toFixed(2)} {selectedDateTotal >= 0 ? 'income' : 'expense'}
              </div>

              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedDateTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center text-xs p-2 bg-muted rounded">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span>{transaction.category}</span>
                      {transaction.notes && (
                        <span className="text-muted-foreground">- {transaction.notes}</span>
                      )}
                    </div>
                    <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};