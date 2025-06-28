
-- Create recurring_budgets table to store budget templates
CREATE TABLE public.recurring_budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category_name TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_category UNIQUE (user_id, category_name)
);

-- Enable RLS for recurring_budgets
ALTER TABLE public.recurring_budgets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for recurring_budgets
CREATE POLICY "Users can view their own recurring budgets"
  ON public.recurring_budgets
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recurring budgets"
  ON public.recurring_budgets
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurring budgets"
  ON public.recurring_budgets
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurring budgets"
  ON public.recurring_budgets
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to generate monthly budgets from recurring templates
CREATE OR REPLACE FUNCTION public.generate_monthly_budgets(
  p_user_id UUID,
  p_month INTEGER,
  p_year INTEGER
) RETURNS VOID AS $$
BEGIN
  -- Insert budgets from recurring templates that don't already exist for this month/year
  INSERT INTO public.budgets (user_id, category_name, amount, month, year)
  SELECT 
    rb.user_id,
    rb.category_name,
    rb.amount,
    p_month,
    p_year
  FROM public.recurring_budgets rb
  WHERE rb.user_id = p_user_id 
    AND rb.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM public.budgets b 
      WHERE b.user_id = rb.user_id 
        AND b.category_name = rb.category_name 
        AND b.month = p_month 
        AND b.year = p_year
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add updated_at trigger for recurring_budgets
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_recurring_budgets_updated_at
  BEFORE UPDATE ON public.recurring_budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();