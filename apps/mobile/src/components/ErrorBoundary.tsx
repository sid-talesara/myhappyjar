import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  children: React.ReactNode;
  label?: string;
}

interface State {
  caught: boolean;
  errorName: string;
  errorMessage: string;
}

/**
 * Simple class-based error boundary.
 * Catches render errors from children (e.g. Phosphor/SVG import failures)
 * and renders a visible debug view instead of a blank screen.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { caught: false, errorName: '', errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('[ErrorBoundary] caught', error.name, error.message);
    return {
      caught: true,
      errorName: error.name ?? 'UnknownError',
      errorMessage: error.message ?? '',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] componentDidCatch', error, info.componentStack);
  }

  render() {
    if (this.state.caught) {
      const { label = 'Component' } = this.props;
      return (
        <View style={styles.container}>
          <Text style={styles.title}>[ErrorBoundary] {label} crashed</Text>
          <Text style={styles.errorName}>{this.state.errorName}</Text>
          <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF4444',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorName: {
    color: '#FFDDDD',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#FFEEEE',
    fontSize: 12,
    textAlign: 'center',
  },
});
