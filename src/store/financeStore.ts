
export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
  type: 'income' | 'expense';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  type: 'income' | 'expense';
  is_system?: boolean;
}

export interface Budget {
  id: string;
  categoryName: string;
  amount: number;
  month: number;
  year: number;
}
