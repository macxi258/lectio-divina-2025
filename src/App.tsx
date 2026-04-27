import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import AndroidBackHandler from './components/AndroidBackHandler';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';
import BibleBrowserPage from './pages/BibleBrowserPage';
import SessionPage from './pages/SessionPage';
import { JournalListPage, JournalEntryPage } from './pages/JournalPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoutes() {
  const user = useStore((s) => s.user);
  if (!user) return <Navigate to="/signin" replace />;
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bible" element={<BibleBrowserPage />} />
        <Route path="/session/:id" element={<SessionPage />} />
        <Route path="/journal" element={<JournalListPage />} />
        <Route path="/journal/:id" element={<JournalEntryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  const user = useStore((s) => s.user);
  return (
    <BrowserRouter>
      <AndroidBackHandler />
      <Routes>
        <Route path="/signin" element={user ? <Navigate to="/" replace /> : <SignInPage />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
