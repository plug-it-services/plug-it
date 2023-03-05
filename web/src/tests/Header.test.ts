import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MessageBox from '../components/MessageBox';

describe('Plug Button', () => {
  it('renders with the correct text', () => {
    render(
      MessageBox({
        description: 'Wow',
        title: 'Title',
        isOpen: true,
        onClose: () => {},
        children: null,
        type: 'success',
      }),
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Wow')).toBeInTheDocument();
  });
});

describe('Plug AdvancedButton', () => {
  it('renders with the correct text', () => {
    render(
      MessageBox({
        description: 'Advanced',
        title: 'Title Advanced',
        isOpen: true,
        onClose: () => {},
        children: null,
        type: 'success',
      }),
    );
    expect(screen.getByText('Title Advanced')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });
});

describe('Plug Button Error', () => {
  it('renders with the correct text', () => {
    render(
      MessageBox({
        description: 'Error',
        title: 'Title',
        isOpen: true,
        onClose: () => {},
        children: null,
        type: 'error',
      }),
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});

describe('Plug Button Info', () => {
  it('renders with the correct text', () => {
    render(
      MessageBox({
        description: 'Wow',
        title: 'Title',
        isOpen: true,
        onClose: () => {},
        children: null,
        type: 'info',
      }),
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Wow')).toBeInTheDocument();
  });
});

describe('Plug Button Warning', () => {
  it('renders with the correct text', () => {
    render(
      MessageBox({
        description: 'Wow',
        title: 'Title',
        isOpen: true,
        onClose: () => {},
        children: null,
        type: 'warning',
      }),
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Wow')).toBeInTheDocument();
  });
});
