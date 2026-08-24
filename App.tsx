import React from 'react';
import SiteHeader from './components/layout/SiteHeader.tsx';
import SiteFooter from './components/layout/SiteFooter.tsx';
import Toast from './components/ui/Toast.tsx';
import OrdinationPage from './pages/OrdinationPage.tsx';
import RegistryPage from './pages/RegistryPage.tsx';
import { useOrdinationManager } from './hooks/useOrdinationManager.ts';
import './styles/index.css';

const App: React.FC = () => {
  const manager = useOrdinationManager();

  return (
    <div className="app-shell">
      <SiteHeader view={manager.view} count={manager.personnel.length} onNavigate={manager.setView} />
      <Toast notice={manager.notice} />
      {manager.view === 'generate'
        ? <OrdinationPage manager={manager} />
        : <RegistryPage manager={manager} />}
      <SiteFooter />
    </div>
  );
};

export default App;
