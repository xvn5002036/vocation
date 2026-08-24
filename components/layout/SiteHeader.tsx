import React from 'react';
import { View } from '../../hooks/useOrdinationManager.ts';
import Icon from '../ui/Icon.tsx';
interface Props { view: View; count: number; onNavigate: (view: View) => void; }
const SiteHeader: React.FC<Props> = ({ view, count, onNavigate }) => (
  <header className="topbar"><button className="brand" onClick={() => onNavigate('generate')} aria-label="回到八字查考"><span className="brand-seal">玉格</span><span><small>新刊天壇</small><strong>八字玉格查考</strong></span></button><nav className="main-nav" aria-label="主要導覽"><button className={view === 'generate' ? 'active' : ''} onClick={() => onNavigate('generate')} title="八字查考"><Icon name="form"/>八字查考</button><button className={view === 'intro' ? 'active' : ''} onClick={() => onNavigate('intro')} title="道壇說明"><Icon name="seal"/>道壇說明</button><button className={view === 'list' ? 'active' : ''} onClick={() => onNavigate('list')} title="八字清冊"><Icon name="book"/>八字清冊<span className="count">{count}</span></button></nav></header>
);
export default SiteHeader;
