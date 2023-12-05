import { GLOBAL_QUERY_PARAM } from '!/routes/domain';
import { Component, ReactNode } from 'react';
// import { createLogger } from '#/logger';

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
      return (
        <iframe className="w-screen h-screen" src={`/error?${GLOBAL_QUERY_PARAM['is-iframe']}#${this.state.message}`} />
      );

    return this.props.children;
  }
}
