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
