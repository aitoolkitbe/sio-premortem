'use client';

import { Gate } from './components/Gate';

export function HomeClient() {
  function handleUnlocked() {
    window.location.href = '/workbench';
  }
  return <Gate onUnlocked={handleUnlocked} />;
}
