import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders FitPulse login page for unauthenticated users', () => {
  render(<App />);
  expect(screen.getByText(/FitPulse/i)).toBeInTheDocument();
});
