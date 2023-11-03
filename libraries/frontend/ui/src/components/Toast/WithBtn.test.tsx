import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from '../Button'; // Update path if needed
import ToastWithBtn from './WithBtn'; // Update path if needed

describe('<ToastWithBtn />', () => {
  it('should render the provided button', () => {
    render(<ToastWithBtn button={<Button>Test Button</Button>} />);
    const button = screen.getByText('Test Button');
    expect(button).toBeInTheDocument();
  });

  it('should display the toast when the button is clicked', () => {
    render(<ToastWithBtn />);
    const button = screen.getByText('토스트');
    fireEvent.click(button);
    const toast = screen.getByRole('alert'); // Assuming your toast has a role of 'alert'
    expect(toast).toBeInTheDocument();
  });
});
