import { Component, type ReactNode } from "react";

interface State { hasError: boolean }

export class ChartErrorBoundary extends Component<{ children: ReactNode; label?: string }, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(): State { return { hasError: true }; }
  componentDidCatch(err: unknown) { console.warn("Chart error:", err); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
          Unable to render this chart.
        </div>
      );
    }
    return this.props.children;
  }
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed bg-muted/20 text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-4">
        <ChartErrorBoundary>{children}</ChartErrorBoundary>
      </div>
    </div>
  );
}
