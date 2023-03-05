import { render, screen } from '@testing-library/react';
import Button from '../components/Button';
import '@testing-library/jest-dom/extend-expect';

describe('Plug Button', () => {
  it('renders with the correct text', () => {
    render(Button({ text: 'Click me' }));
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});

describe('Plug Color Button', () => {
  it('renders with the correct text', () => {
    render(Button({ text: 'Color Click', color: 'primary' }));
    expect(screen.getByText('Color Click')).toBeInTheDocument();
  });
});

describe('Plug Color Rect Button', () => {
  it('renders with the correct text', () => {
    render(Button({ text: 'Rect Color Click', color: 'primary', buttonStyle: 'rectangle' }));
    expect(screen.getByText('Rect Color Click')).toBeInTheDocument();
  });
});

describe('Plug Color Circle Button', () => {
  it('renders with the correct text', () => {
    render(Button({ text: 'Circle Color Click', color: 'primary', buttonStyle: 'circle' }));
    expect(screen.getByText('Circle Color Click')).toBeInTheDocument();
  });
});
