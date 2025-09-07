import React, { Component, ReactNode } from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error: ", error, errorInfo);
  }

  retry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-base-100 text-content-primary">
          <ShieldCheckIcon className="h-12 w-12 text-brand-primary mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Something went wrong.</h1>
          <p className="text-content-secondary mb-4">We're sorry, but an unexpected error occurred.</p>
          <button
            onClick={this.retry}
            className="px-4 py-2 bg-brand-secondary text-white rounded-md hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          >
            Retry
          </button>
          {/* Optionally add a link to the home page */}
          {/* <Link href="/">Go back to home</Link> */}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

