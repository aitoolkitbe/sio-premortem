import { Workbench } from '../components/Workbench';

export const dynamic = 'force-dynamic';

export default function WorkbenchPage() {
  // Auth wordt afgedwongen door middleware.ts — als we hier geraken, is de sessie geldig.
  return <Workbench />;
}
