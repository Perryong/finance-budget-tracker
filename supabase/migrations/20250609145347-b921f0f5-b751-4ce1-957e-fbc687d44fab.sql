
-- Drop the existing function and recreate with enhanced categories
DROP FUNCTION IF EXISTS public.setup_default_categories(uuid);

CREATE OR REPLACE FUNCTION public.setup_default_categories(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO categories (user_id, name, color, type, is_system) VALUES
    -- HOUSING & UTILITIES (Red tones)
    (user_uuid, 'Rent/Mortgage', '#dc2626', 'expense', true),
    (user_uuid, 'Property Tax', '#b91c1c', 'expense', true),
    (user_uuid, 'Home Insurance', '#991b1b', 'expense', true),
    (user_uuid, 'Home Maintenance', '#7f1d1d', 'expense', true),
    (user_uuid, 'Utilities', '#ef4444', 'expense', true),
    (user_uuid, 'Internet & Cable', '#f87171', 'expense', true),
    
    -- TRANSPORTATION (Green tones)
    (user_uuid, 'Fuel/Gas', '#16a34a', 'expense', true),
    (user_uuid, 'Public Transport', '#22c55e', 'expense', true),
    (user_uuid, 'Car Payment', '#15803d', 'expense', true),
    (user_uuid, 'Car Insurance', '#166534', 'expense', true),
    (user_uuid, 'Car Maintenance', '#14532d', 'expense', true),
    (user_uuid, 'Parking & Tolls', '#052e16', 'expense', true),
    (user_uuid, 'Uber/Taxi', '#84cc16', 'expense', true),
    
    -- FOOD & DINING (Orange tones)
    (user_uuid, 'Groceries', '#ea580c', 'expense', true),
    (user_uuid, 'Restaurants', '#f97316', 'expense', true),
    (user_uuid, 'Fast Food', '#fb923c', 'expense', true),
    (user_uuid, 'Coffee & Drinks', '#fdba74', 'expense', true),
    (user_uuid, 'Alcohol & Bars', '#fed7aa', 'expense', true),
    (user_uuid, 'Food Delivery', '#d97706', 'expense', true),
    
    -- HEALTH & FITNESS (Cyan/Teal tones)
    (user_uuid, 'Healthcare', '#0891b2', 'expense', true),
    (user_uuid, 'Health Insurance', '#06b6d4', 'expense', true),
    (user_uuid, 'Medications', '#0e7490', 'expense', true),
    (user_uuid, 'Dental Care', '#155e75', 'expense', true),
    (user_uuid, 'Vision Care', '#164e63', 'expense', true),
    (user_uuid, 'Gym & Fitness', '#083344', 'expense', true),
    (user_uuid, 'Personal Care', '#67e8f9', 'expense', true),
    
    -- SUBSCRIPTIONS & DIGITAL (Blue tones)
    (user_uuid, 'Subscriptions', '#2563eb', 'expense', true),
    (user_uuid, 'Streaming Services', '#3b82f6', 'expense', true),
    (user_uuid, 'Software & Apps', '#1d4ed8', 'expense', true),
    (user_uuid, 'Music Streaming', '#1e40af', 'expense', true),
    (user_uuid, 'Cloud Storage', '#1e3a8a', 'expense', true),
    (user_uuid, 'Gaming Subscriptions', '#312e81', 'expense', true),
    
    -- SHOPPING & PERSONAL (Purple tones)
    (user_uuid, 'Clothing', '#7c3aed', 'expense', true),
    (user_uuid, 'Electronics', '#8b5cf6', 'expense', true),
    (user_uuid, 'Books & Education', '#6d28d9', 'expense', true),
    (user_uuid, 'Hobbies', '#5b21b6', 'expense', true),
    (user_uuid, 'Gifts', '#4c1d95', 'expense', true),
    (user_uuid, 'Beauty & Cosmetics', '#581c87', 'expense', true),
    
    -- FINANCIAL & INSURANCE (Indigo tones)
    (user_uuid, 'Bank Fees', '#4338ca', 'expense', true),
    (user_uuid, 'Investment Fees', '#3730a3', 'expense', true),
    (user_uuid, 'Credit Card Fees', '#312e81', 'expense', true),
    (user_uuid, 'ATM Fees', '#1e1b4b', 'expense', true),
    (user_uuid, 'Late Fees', '#6366f1', 'expense', true),
    (user_uuid, 'Loan Payments', '#818cf8', 'expense', true),
    
    -- FAMILY & CHILDREN (Pink tones)
    (user_uuid, 'Childcare', '#db2777', 'expense', true),
    (user_uuid, 'School & Education', '#ec4899', 'expense', true),
    (user_uuid, 'Baby Supplies', '#be185d', 'expense', true),
    (user_uuid, 'Kids Activities', '#9d174d', 'expense', true),
    (user_uuid, 'School Supplies', '#831843', 'expense', true),
    (user_uuid, 'Tutoring', '#701a75', 'expense', true),
    
    -- ENTERTAINMENT & LIFESTYLE (Rose tones)
    (user_uuid, 'Movies & Events', '#f43f5e', 'expense', true),
    (user_uuid, 'Concerts & Shows', '#e11d48', 'expense', true),
    (user_uuid, 'Sports Events', '#be123c', 'expense', true),
    (user_uuid, 'Bars & Nightlife', '#9f1239', 'expense', true),
    (user_uuid, 'Gaming', '#881337', 'expense', true),
    (user_uuid, 'Books & Magazines', '#fb7185', 'expense', true),
    
    -- TRAVEL & VACATION (Emerald tones)
    (user_uuid, 'Vacation', '#059669', 'expense', true),
    (user_uuid, 'Hotels & Lodging', '#047857', 'expense', true),
    (user_uuid, 'Flights', '#065f46', 'expense', true),
    (user_uuid, 'Travel Insurance', '#064e3b', 'expense', true),
    (user_uuid, 'Car Rental', '#022c22', 'expense', true),
    (user_uuid, 'Travel Food', '#10b981', 'expense', true),
    
    -- PETS (Amber tones)
    (user_uuid, 'Pet Food', '#d97706', 'expense', true),
    (user_uuid, 'Vet Bills', '#f59e0b', 'expense', true),
    (user_uuid, 'Pet Supplies', '#eab308', 'expense', true),
    (user_uuid, 'Pet Insurance', '#ca8a04', 'expense', true),
    (user_uuid, 'Pet Grooming', '#a16207', 'expense', true),
    
    -- TAXES & GOVERNMENT (Stone tones)
    (user_uuid, 'Income Tax', '#57534e', 'expense', true),
    (user_uuid, 'Property Tax', '#44403c', 'expense', true),
    (user_uuid, 'Vehicle Registration', '#292524', 'expense', true),
    (user_uuid, 'Government Fees', '#1c1917', 'expense', true),
    (user_uuid, 'Professional Licenses', '#78716c', 'expense', true),
    
    -- SAVINGS & INVESTMENTS (Emerald variants)
    (user_uuid, 'Emergency Fund', '#10b981', 'expense', true),
    (user_uuid, 'Retirement Savings', '#059669', 'expense', true),
    (user_uuid, 'Investment Contributions', '#047857', 'expense', true),
    (user_uuid, 'Savings Goals', '#065f46', 'expense', true),
    
    -- BUSINESS & PROFESSIONAL (Slate tones)
    (user_uuid, 'Office Supplies', '#475569', 'expense', true),
    (user_uuid, 'Professional Development', '#334155', 'expense', true),
    (user_uuid, 'Business Meals', '#1e293b', 'expense', true),
    (user_uuid, 'Marketing & Advertising', '#0f172a', 'expense', true),
    (user_uuid, 'Professional Services', '#64748b', 'expense', true),
    
    -- CATCH-ALL (Gray tones)
    (user_uuid, 'Miscellaneous', '#6b7280', 'expense', true),
    (user_uuid, 'Other Expenses', '#4b5563', 'expense', true),
    (user_uuid, 'Cash Withdrawals', '#374151', 'expense', true),
    (user_uuid, 'Returns & Refunds', '#9ca3af', 'expense', true),
    
    -- INCOME CATEGORIES (Bright positive colors)
    -- Regular Income (Green variants)
    (user_uuid, 'Salary', '#22c55e', 'income', true),
    (user_uuid, 'Hourly Wages', '#16a34a', 'income', true),
    (user_uuid, 'Overtime Pay', '#15803d', 'income', true),
    (user_uuid, 'Tips', '#166534', 'income', true),
    (user_uuid, 'Commission', '#14532d', 'income', true),
    
    -- Side Income (Lime variants)
    (user_uuid, 'Freelance', '#84cc16', 'income', true),
    (user_uuid, 'Consulting', '#65a30d', 'income', true),
    (user_uuid, 'Side Hustle', '#4d7c0f', 'income', true),
    (user_uuid, 'Gig Work', '#365314', 'income', true),
    (user_uuid, 'Part-time Job', '#1a2e05', 'income', true),
    
    -- Investment Income (Blue variants)
    (user_uuid, 'Dividends', '#3b82f6', 'income', true),
    (user_uuid, 'Interest Income', '#2563eb', 'income', true),
    (user_uuid, 'Capital Gains', '#1d4ed8', 'income', true),
    (user_uuid, 'Rental Income', '#1e40af', 'income', true),
    (user_uuid, 'Investment Returns', '#1e3a8a', 'income', true),
    
    -- Bonus Income (Yellow variants)
    (user_uuid, 'Bonus', '#eab308', 'income', true),
    (user_uuid, 'Tax Refund', '#f59e0b', 'income', true),
    (user_uuid, 'Cash Back', '#d97706', 'income', true),
    (user_uuid, 'Rewards', '#b45309', 'income', true),
    (user_uuid, 'Rebates', '#92400e', 'income', true),
    
    -- Government & Benefits (Teal variants)
    (user_uuid, 'Unemployment', '#14b8a6', 'income', true),
    (user_uuid, 'Social Security', '#0d9488', 'income', true),
    (user_uuid, 'Disability', '#0f766e', 'income', true),
    (user_uuid, 'Child Support', '#115e59', 'income', true),
    (user_uuid, 'Government Benefits', '#134e4a', 'income', true),
    
    -- Other Income (Purple variants)
    (user_uuid, 'Gifts Received', '#a855f7', 'income', true),
    (user_uuid, 'Inheritance', '#9333ea', 'income', true),
    (user_uuid, 'Insurance Payouts', '#7c3aed', 'income', true),
    (user_uuid, 'Legal Settlements', '#6d28d9', 'income', true),
    (user_uuid, 'Prize Winnings', '#5b21b6', 'income', true),
    (user_uuid, 'Other Income', '#4c1d95', 'income', true)
  ON CONFLICT (user_id, name) DO NOTHING;
END;
$function$;
