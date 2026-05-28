# Pundo Wealth Manager (v1.1.0)

Pundo is a comprehensive, modern personal finance and wealth management dashboard built to help you track expenses, set savings goals, and manage your financial health effortlessly.

## 🚀 Features

- **Customizable Dashboard:** Drag and drop dashboard widgets (Overview, Charts, Transactions) that save securely to your profile.
- **Interactive Charting:** Dynamic charts with timeframe toggles (3, 6, 12 months) and custom hover tooltips.
- **Global Localization (i18n):** Instantly switch between English, Spanish, and French.
- **Transactions & Goal Management:** Log income and expenses, set savings targets, and automatically track your progress.
- **Material Design 3 UI & Animations:** Beautifully crafted interface featuring Glassmorphism, Framer Motion page transitions, micro-animations, and animated Skeleton loaders.
- **Advanced Profiles:** Support for custom profile picture uploads (via Supabase Storage) and strict password change verification.
- **Dark Mode Support:** Seamlessly toggle between Light and Dark modes.
- **Progressive Web App (PWA):** Installable on mobile and desktop for offline capabilities and a native app experience.

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

## 🎨 Design

Pundo's user interface has been completely overhauled based on a custom Material Design 3 design system. It utilizes CSS variables mapped to Tailwind `@theme` directives to ensure a robust and easily maintainable Dark/Light mode toggle.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
