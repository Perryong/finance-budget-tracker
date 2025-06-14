import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
import { Transaction } from '@/store/financeStore';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TransactionCalendarProps {
  transactions: Transaction[];
}

export const TransactionCalendar = ({ transactions }: TransactionCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Get all transaction dates
  const transactionDates = useMemo(
    () => transactions.map(t => new Date(t.date)),
    [transactions]
  );

  // Get transactions for selected date
  const selectedDateTransactions = useMemo(
    () =>
      selectedDate
        ? transactions.filter(t => isSameDay(new Date(t.date), selectedDate))
        : [],
    [selectedDate, transactions]
  );

  // Calculate totals
  const selectedDateTotals = useMemo(() => {
    return selectedDateTransactions.reduce(
      (acc, t) => {
        if (t.type === 'income') {
          acc.income += t.amount;
          acc.total += t.amount;
        } else {
          acc.expense += Math.abs(t.amount);
          acc.total -= Math.abs(t.amount);
        }
        return acc;
      },
      { income: 0, expense: 0, total: 0 }
    );
  }, [selectedDateTransactions]);

  // Create a modifier for dates with transactions
  const modifiers = useMemo(() => {
    const dateMap = new Map();
    transactionDates.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      dateMap.set(dateStr, true);
    });
    
    return {
      hasTransaction: (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return dateMap.has(dateStr);
      }
    };
  }, [transactionDates]);
  
  // Custom component for day rendering
  const DayComponent = (props: any) => {
    const { date, ...other } = props;
    const hasTransaction = modifiers.hasTransaction(date);
    
    return (
      <div 
        className={cn(
          "w-full h-full relative",
          hasTransaction && "relative"
        )}
        {...other}
      >
        {props.children}
        {hasTransaction && (
          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4 bg-background rounded-xl shadow-lg">
      {/* Calendar */}
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          weekStartsOn={1} // Start on Monday
          className={cn("p-4 border rounded-lg bg-card")}
          components={{
            Day: (props) => {
              const date = props.day.date;
              const hasTransaction = modifiers.hasTransaction(date);
              
              return (
                <div className={cn(
                  "relative flex justify-center p-0 h-full",
                  hasTransaction && "font-medium"
                )}>
                  {props.children}
                  {hasTransaction && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </div>
              );
            }
          }}
        />
      </div>

      {/* Transaction Details */}
      {selectedDate && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">
            Transactions for {format(selectedDate, 'PPP')}
          </h3>

          {selectedDateTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions on this date</p>
          ) : (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <span className="text-sm text-muted-foreground">Income</span>
                  <p className="text-lg font-medium text-green-600">
                    ${selectedDateTotals.income.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Expense</span>
                  <p className="text-lg font-medium text-red-600">
                    ${selectedDateTotals.expense.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Net Total</span>
                  <p
                    className={cn(
                      'text-lg font-medium',
                      selectedDateTotals.total >= 0 ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    ${Math.abs(selectedDateTotals.total).toFixed(2)}{' '}
                    {selectedDateTotals.total >= 0 ? 'income' : 'expense'}
                  </p>
                </div>
              </div>

              {/* Transaction List */}
              <ScrollArea className="h-64 rounded-lg">
                <div className="space-y-2">
                  {selectedDateTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex justify-between items-center p-3 bg-card rounded-lg shadow-sm hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={cn(
                            'w-3 h-3 rounded-full',
                            transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                          )}
                        />
                        <div>
                          <p className="text-sm font-medium">{transaction.category}</p>
                          {transaction.notes && (
                            <p className="text-xs text-muted-foreground">{transaction.notes}</p>
                          )}
                        </div>
                      </div>
                      <span
                        className={cn(
                          'text-sm font-medium',
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      )}
    </div>
  );
};