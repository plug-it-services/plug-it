import { render, screen } from '@testing-library/react';
import Button from '../components/Button';
import '@testing-library/jest-dom/extend-expect';

describe('Plug Button', () => {
  it('renders with the correct text', () => {
    render(Button({ text: 'Click me' }));
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
