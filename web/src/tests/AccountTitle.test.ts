import { render, screen } from '@testing-library/react';
import AccountTile from '../components/AccountTile';
import '@testing-library/jest-dom/extend-expect';

describe('Plug InputBar', () => {
  it('renders with the correct text', () => {
    render(
      AccountTile({
        name: 'Click me',
        firstName: 'Click me',
        id: 0,
        email: 'tri@epitech.eu',
        onDisconnect: () => {},
      }),
    );
    expect(screen.getByText('tri@epitech.eu')).toBeInTheDocument();
  });
});
