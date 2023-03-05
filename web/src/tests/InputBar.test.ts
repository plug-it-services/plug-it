import { render, screen } from '@testing-library/react';
import InputBar from '../components/InputBar';
import '@testing-library/jest-dom/extend-expect';

describe('Plug InputBar', () => {
  it('renders with the correct text', () => {
    render(
      InputBar({
        placeholder: 'Click me',
        textColor: '#000000',
        backgroundColor: '#000000',
        borderColor: '#000000',
        isPassword: false,
        onChange: () => {},
        onSubmit: () => {},
        value: 'Click me',
      }),
    );
    expect(screen.getByDisplayValue('Click me')).toBeInTheDocument();
  });
});

describe('Plug InputBar Password', () => {
  it('renders with the correct text', () => {
    render(
      InputBar({
        placeholder: 'Click me',
        textColor: '#000000',
        backgroundColor: '#000000',
        borderColor: '#000000',
        isPassword: true,
        onChange: () => {},
        onSubmit: () => {},
        value: 'Click me',
      }),
    );
    expect(screen.getByDisplayValue('Click me')).toBeInTheDocument();
  });
});
