import React from 'react';
import { View } from '../../hooks/useOrdinationManager.ts';
import Icon from '../ui/Icon.tsx';

interface Props { view: View; count: number; onNavigate: (view: View) => void; }

const SiteHeader: React.FC<Props> = ({ view, count, onNavigate }) => (
  <header className="topbar">
    <button className="brand" onClick={() => onNavigate('generate')} aria-label="回到錄籍">
      <span className="brand-seal">正一</span><span><small>龍虎山正一</small><strong>授籙管理系統</strong></span>
    </button>
    <nav className="main-nav" aria-label="主要導覽">
      <button className={view === 'generate' ? 'active' : ''} onClick={() => onNavigate('generate')}><Icon name="form"/>錄籍作業</button>
      <button className={view === 'list' ? 'active' : ''} onClick={() => onNavigate('list')}><Icon name="book"/>弟子清冊<span className="count">{count}</span></button>
    </nav>
  </header>
);

export default SiteHeader;
