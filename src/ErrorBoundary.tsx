import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode; // Define the children prop
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>; // You can customize the error message
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
