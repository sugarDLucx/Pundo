# Pundo Wealth Manager (v1.3.0)

Pundo is a comprehensive, modern personal finance and wealth management dashboard built to help you track expenses, set savings goals, and manage your financial health effortlessly.

## 🚀 Features

- **Mobile First & Responsive:** Fully optimized for mobile devices with framer-motion dropdown navigation, responsive data cards, and layout reflows.
- **Customizable Dashboard:** Drag and drop dashboard widgets (Overview, Charts, Transactions) that save securely to your profile.
- **Interactive Charting:** Dynamic charts with timeframe toggles and smart Y-axis scaling using Recharts.
- **Smart Analytics:** Real-time summary cards tracking monthly spending, top categories, and largest expenses.
- **Advanced Filtering:** Dynamically filter transactions by timeframe, dynamic categories, and income/expense types.
- **In-App Notifications:** Real-time push notifications for goals, large transactions, and system updates directly in the app.
- **Global Localization (i18n):** Instantly switch between multiple languages and over a dozen global base currencies.
- **Transactions & Goal Management:** Log income and expenses, set savings targets, and automatically track your progress.
- **Material Design 3 UI & Animations:** Beautifully crafted interface featuring Glassmorphism, Framer Motion page transitions, category-specific theming, and animated Skeleton loaders.
- **Advanced Profiles:** Support for custom profile picture uploads (via Supabase Storage) and strict password change verification.
- **Dark Mode Support:** Seamlessly toggle between Light and Dark modes with completely custom theming.
- **Accessibility:** Fully accessible semantic HTML, proper contrast ratios, and connected form elements.

## 🛠️ Technology Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS v4 (Custom Material 3 Design Tokens)
- **State Management:** Zustand
- **Database & Authentication:** Supabase
- **Data Visualization:** Recharts
- **Icons:** Google Material Symbols Outlined

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- A Supabase account and project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sugarDLucx/Pundo.git
   cd Pundo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 🚀 Deployment (Vercel)

Pundo is fully optimized and ready to be deployed to Vercel. 
Simply link your GitHub repository to Vercel and ensure you add the following Environment Variables in your Vercel project settings:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Vercel will automatically detect the Vite build settings (`npm run build` and output directory `dist`).

## 🎨 Design

Pundo's user interface has been completely overhauled based on a custom Material Design 3 design system. It utilizes CSS variables mapped to Tailwind `@theme` directives to ensure a robust and easily maintainable Dark/Light mode toggle.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
