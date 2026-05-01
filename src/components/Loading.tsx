import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/20" />
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-lg font-semibold text-foreground">SalesIQ</h3>
          <p className="text-sm text-muted-foreground">Preparing your dashboard...</p>
        </div>
      </div>
    </div>
  );
}
