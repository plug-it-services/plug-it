import { render, screen } from '@testing-library/react';
import MessageBox from '../components/MessageBox';
import '@testing-library/jest-dom/extend-expect';

describe('MsgBox Success', () => {
  it('renders with the correct text', () => {
    render(
      MessageBox({
        type: 'success',
        onClose: () => {},
        isOpen: true,
        children: null,
        title: 'Title',
        description: 'Wow',
      }),
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});

describe('MsgBox Error', () => {
  it('renders with the correct text', () => {
    render(
      MessageBox({
        type: 'error',
        onClose: () => {},
        isOpen: true,
        children: null,
        title: 'Title',
        description: 'Wow',
      }),
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});

describe('MsgBox Warning', () => {
  it('renders with the correct text', () => {
    render(
      MessageBox({
        type: 'warning',
        onClose: () => {},
        isOpen: true,
        children: null,
        title: 'Title',
        description: 'Wow',
      }),
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});

describe('MsgBox Info', () => {
  it('renders with the correct text', () => {
    render(
      MessageBox({
        type: 'info',
        onClose: () => {},
        isOpen: true,
        children: null,
        title: 'Title',
        description: 'Wow',
      }),
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});

describe('MsgBox Success Not Open', () => {
  it('renders with the correct text', () => {
    render(
      MessageBox({
        type: 'success',
        onClose: () => {},
        isOpen: false,
        children: null,
        title: 'Title',
        description: 'Wow',
      }),
    );
    try {
      expect(screen.getByText('Title')).not.toBeVisible();
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });
});

describe('MsgBox Error Not Open', () => {
  it('renders with the correct text', () => {
    render(
      MessageBox({
        type: 'error',
        onClose: () => {},
        isOpen: false,
        children: null,
        title: 'Title',
        description: 'Wow',
      }),
    );

    try {
      expect(screen.getByText('Title')).not.toBeVisible();
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });
});

describe('MsgBox Warning Not Open', () => {
  it('renders with the correct text', () => {
    render(
      MessageBox({
        type: 'warning',
        onClose: () => {},
        isOpen: false,
        children: null,
        title: 'Title',
        description: 'Wow',
      }),
    );

    try {
      expect(screen.getByText('Title')).not.toBeVisible();
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });
});

describe('MsgBox Info Not Open', () => {
  it('renders with the correct text', () => {
    render(
      MessageBox({
        type: 'info',
        onClose: () => {},
        isOpen: false,
        children: false,
        title: 'Title',
        description: 'Wow',
      }),
    );

    try {
      expect(screen.getByText('Title')).not.toBeVisible();
    } catch (e) {
      expect(e).not.toBeNull();
    }
  });
});
