import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { appRoutes } from './core/constants/routes';
import { LoginPage } from './presentation/pages/LoginPage';
import { QuotePage } from './presentation/pages/QuotePage';
import { useAuthStore } from './presentation/store/auth.store';

function ProtectedRoute({ children }: { children: ReactElement }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={appRoutes.login} replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }: { children: ReactElement }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={appRoutes.quoter} replace />;
  }

  return children;
}

export default function App() {
  const hydrateSession = useAuthStore((state) => state.hydrateSession);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    hydrateSession();
    setIsHydrated(true);
  }, [hydrateSession]);

  if (!isHydrated) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={appRoutes.login}
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path={appRoutes.quoter}
          element={
            <ProtectedRoute>
              <QuotePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={appRoutes.quoter} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
