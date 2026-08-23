import React, { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SafeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn(
      `[SafeErrorBoundary] Caught error in ${this.props.name || "component"}:`,
      error,
      errorInfo,
    );
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }
      return (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 font-mono text-xs text-destructive">
          <p className="font-semibold">
            Component Error ({this.props.name || "Unknown"}):
          </p>
          <p className="mt-1 opacity-80">
            {this.state.error?.message || String(this.state.error)}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
