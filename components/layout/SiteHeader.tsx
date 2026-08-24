import React from 'react';
import { View } from '../../hooks/useOrdinationManager.ts';
import Icon from '../ui/Icon.tsx';
interface Props { view: View; count: number; onNavigate: (view: View) => void; }
const SiteHeader: React.FC<Props> = ({ view, count, onNavigate }) => (
  <header className="topbar"><button className="brand" onClick={() => onNavigate('generate')} aria-label="回到本命查考"><span className="brand-seal">玉格</span><span><small>神霄天壇</small><strong>本命玉格查考</strong></span></button><nav className="main-nav" aria-label="主要導覽"><button className={view === 'generate' ? 'active' : ''} onClick={() => onNavigate('generate')}><Icon name="form"/>本命查考</button><button className={view === 'list' ? 'active' : ''} onClick={() => onNavigate('list')}><Icon name="book"/>本命清冊<span className="count">{count}</span></button></nav></header>
);
export default SiteHeader;
