'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { quickZaloConsult } from '@/src/lib/zalo';

export function ZaloCta() {
  return (
    <Button
      onClick={() => quickZaloConsult()}
      className="mt-4 gap-2 bg-white text-brand-700 hover:bg-brand-50"
    >
      <MessageCircle className="h-4 w-4" />
      Tư vấn qua Zalo
    </Button>
  );
}
