'use client';
// TODO Step 2.8: fetch full product data, show in dialog, update URL ?quickview=id
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api';

interface QuickViewProps {
  productId: string | null;
  onClose: () => void;
}

export function QuickView({ productId, onClose }: QuickViewProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => apiClient.getProduct(productId!),
    enabled: !!productId,
  });

  return (
    <Dialog open={!!productId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isLoading ? <Skeleton className="h-6 w-48" /> : data?.name}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <div className="text-sm text-gray-600">
            {/* TODO Step 2.8: full product detail layout */}
            <p>{data?.description}</p>
            <p className="font-bold mt-2">{/* TODO Step 2.8: fetch pricing */}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
