import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './app/AuthContext';

import Login from './features/auth/Login';
import Layout from './components/layout/Layout';


export default function App() {
  const { session, cargando } = useAuth();

  if (cargando) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium">Cargando SUGED...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
      
      <Route element={session ? <Layout /> : <Navigate to="/login" />}>
      </Route>

      <Route path="*" element={<Navigate to={session ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}