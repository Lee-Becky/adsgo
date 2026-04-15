import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 14, color: '#6b7280' }}>页面出现异常，请刷新重试</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '6px 16px', fontSize: 13, background: '#6366f1', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            刷新页面
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
