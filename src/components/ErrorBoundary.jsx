import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return <div>Error loading component</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;