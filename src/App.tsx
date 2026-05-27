import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Goals } from './pages/Goals';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const user = useAuthStore((state) => state.user);
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
