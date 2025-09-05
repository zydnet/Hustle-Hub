import Statusman from '@/components/statusman/statusman';
import { RefreshProvider } from '@/app/_contexts/refresh';

export default function HomeDisp() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <RefreshProvider>
        <Statusman />
      </RefreshProvider>
    </div>
  );
}
