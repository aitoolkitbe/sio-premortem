import { redirect } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { HomeClient } from './HomeClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const ok = await requireSession();
  if (ok) {
    redirect('/workbench');
  }
  return <HomeClient />;
}
