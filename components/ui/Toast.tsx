import React from 'react';
import { Notice } from '../../hooks/useOrdinationManager.ts';

const Toast: React.FC<{ notice: Notice }> = ({ notice }) => notice ? (
  <div className={`toast ${notice.kind}`} role="status">
    <span>{notice.kind === 'success' ? '✓' : '!'}</span>{notice.message}
  </div>
) : null;

export default Toast;
