# 💰 Finance Budget Tracker - Personal Finance Tracker

A comprehensive personal finance management application built with React, TypeScript, and Supabase. Track your income, expenses, budgets, and savings goals with an intuitive dashboard and powerful analytics.

## ✨ Features

### 📊 Dashboard
- **Monthly Overview**: Real-time income, expenses, and net balance tracking
- **Interactive Calendar**: Visual transaction calendar with daily summaries
- **Expense Breakdown**: Doughnut charts showing spending by category
- **Savings Tracking**: Monitor monthly and current savings progress

### 💸 Transaction Management
- **Add/Edit/Delete**: Full CRUD operations for transactions
- **Categorization**: 100+ pre-defined categories across income and expenses
- **Transaction History**: Organized by date with search and filtering
- **Notes & Details**: Add descriptions and context to transactions

### 🎯 Budget Tracking
- **Monthly Budgets**: Set spending limits by category
- **Progress Monitoring**: Visual progress bars and charts
- **Budget vs Actual**: Compare planned vs actual spending
- **Smart Insights**: AI-powered recommendations and alerts

### 🎖️ Financial Goals
- **Emergency Fund Tracker**: Monitor progress toward emergency savings
- **Target Setting**: Set income goals and savings targets
- **Progress Visualization**: Track goal completion with charts
- **Time Estimates**: Calculate time to reach financial goals

### 📋 Monthly Ledger
- **Complete Transaction History**: Detailed monthly transaction logs
- **Export Functionality**: Download CSV reports
- **Running Balance**: Track cumulative balance changes
- **Sorting & Filtering**: Organize data by date, amount, or category

### ⚙️ Settings & Customization
- **Theme Support**: Light and dark mode options
- **Category Management**: Create, edit, and organize custom categories
- **User Preferences**: Personalize your finance tracking experience
- **Enhanced Categories**: 100+ real-world categorized expense and income types

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd money-motion-view
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   The application uses Supabase with the following tables:
   - `transactions` - Store income and expense records
   - `categories` - Manage transaction categories
   - `budgets` - Monthly budget allocations
   - `user_settings` - User preferences and goals
   - `audit_logs` - System logging and debugging

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Recharts** - Beautiful data visualization
- **Chart.js** - Advanced charting capabilities

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication & user management
  - API generation

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation
- **Date-fns** - Date manipulation utilities

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── auth/            # Authentication components
│   ├── budget/          # Budget-related components
│   ├── settings/        # Settings page components
│   └── target/          # Goal tracking components
├── hooks/               # Custom React hooks
├── integrations/        # Third-party integrations
│   └── supabase/        # Supabase client and types
├── lib/                 # Utility functions and configs
├── pages/               # Page components
├── services/            # API and business logic
├── store/               # State management (Zustand)
└── styles/              # Global styles and themes
```

## 🔧 Key Components

### State Management
The application uses Zustand for state management with separate stores:
- `transactionStore` - Transaction CRUD operations
- `categoryStore` - Category management
- `budgetStore` - Budget tracking
- `userSettingsStore` - User preferences and goals

### Services Layer
- `supabaseService` - Database operations
- `budgetService` - Budget-specific operations
- `defaultDataService` - Initial data setup

### Authentication
- Supabase Auth integration
- Protected routes and components
- Automatic session management
- User-specific data isolation

## 🎨 UI Features

### Theme Support
- Light and dark mode themes
- Consistent color schemes
- Automatic theme persistence
- System preference detection

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Adaptive layouts

### Data Visualization
- Interactive charts and graphs
- Color-coded categories
- Progress indicators
- Calendar heatmaps

## 🔒 Security

### Row Level Security (RLS)
- User data isolation
- Secure API endpoints
- Authentication-based access control

### Data Protection
- Encrypted data transmission
- Secure session management
- Input validation and sanitization

## 📈 Advanced Features

### Budget Intelligence
- Overspending alerts
- Trend analysis
- Category-based insights
- Progress tracking

### Export & Reporting
- CSV data export
- Monthly summaries
- Transaction history
- Custom date ranges

### Category System
- 100+ pre-defined categories
- Hierarchical organization
- Custom category creation
- Color-coded classification

## 🚧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Database Schema
The application uses a normalized database schema with proper relationships and constraints. Key tables include transactions, categories, budgets, and user_settings.

### API Integration
All data operations go through Supabase's auto-generated APIs with TypeScript support for type safety.

## 🐛 Debugging

The application includes comprehensive debugging tools:
- Supabase connection diagnostics
- Transaction validation
- Error logging and reporting
- Development-time debugging panels

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Lucide](https://lucide.dev/) for the icon library
- [Recharts](https://recharts.org/) for data visualization

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Finance Budget Tracker** - Take control of your financial future with intelligent tracking and insights! 💪💰