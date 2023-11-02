import { Component, ReactNode } from 'react';
// import { createLogger } from '@package-frontend/utils';

/* ======   interface   ====== */
export interface ErrorBoundaryProps {
  children?: ReactNode;
  error?: string;
}

interface ErrorBoundaryState {
  message?: string;
}
/* ======    global     ====== */
// const logger = createLogger('components/Test');
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {};

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { message: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.message)
      return <h1>{`${this.props.error ?? 'Sorry.. there was an error'} ${this.state.message}`}</h1>;

    return this.props.children;
  }
}
