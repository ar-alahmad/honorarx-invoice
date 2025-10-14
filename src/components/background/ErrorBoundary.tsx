'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary - Graceful fallback for WebGL/Three.js errors
 * Provides a fallback UI when the dynamic background fails to load
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('DynamicBackground Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className='fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center'>
            <div className='text-center text-white'>
              <h2 className='text-2xl font-bold mb-4'>Background Loading</h2>
              <p className='text-gray-400'>Using fallback background</p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
