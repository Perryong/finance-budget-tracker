
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
import { Transaction } from '@/store/financeStore';
import { cn } from '@/lib/utils';

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
    <div className="space-y-3 sm:space-y-4">
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className={cn("p-2 sm:p-3 pointer-events-auto w-full max-w-sm")}
          classNames={{
            months: "flex flex-col space-y-4",
            month: "space-y-4 w-full",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-xs sm:text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-6 w-6 sm:h-7 sm:w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-xs sm:text-sm",
            row: "flex w-full mt-1 sm:mt-2",
            cell: "flex-1 text-center text-xs sm:text-sm p-0 relative",
            day: "h-7 w-full sm:h-9 p-0 font-normal aria-selected:opacity-100 text-xs sm:text-sm",
          }}
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
      </div>
      
      {selectedDate && (
        <div className="border-t pt-3 sm:pt-4">
          <h4 className="font-medium text-xs sm:text-sm mb-2 sm:mb-3">
            Transactions for {format(selectedDate, 'PPP')}
          </h4>
          
          {selectedDateTransactions.length === 0 ? (
            <p className="text-xs sm:text-sm text-muted-foreground">No transactions on this date</p>
          ) : (
            <div className="space-y-2">
              <div className={`text-xs sm:text-sm font-medium ${selectedDateTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Total: ${Math.abs(selectedDateTotal).toFixed(2)} {selectedDateTotal >= 0 ? 'income' : 'expense'}
              </div>
              
              <div className="space-y-1 max-h-24 sm:max-h-32 overflow-y-auto">
                {selectedDateTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center text-xs p-1.5 sm:p-2 bg-muted rounded">
                    <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
                      <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="truncate">{transaction.category}</span>
                      {transaction.notes && (
                        <span className="text-muted-foreground truncate hidden sm:inline">- {transaction.notes}</span>
                      )}
                    </div>
                    <span className={`font-medium flex-shrink-0 ml-2 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
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