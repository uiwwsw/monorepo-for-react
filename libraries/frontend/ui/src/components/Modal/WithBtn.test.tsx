import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button'; // Update path if needed
import ModalWithBtn from './WithBtn'; // Update path if needed

describe('<ModalWithBtn />', () => {
  it('should render the provided button', () => {
    render(<ModalWithBtn button={<Button>Test Button</Button>} />);
    const button = screen.getByText('Test Button');
    expect(button).toBeInTheDocument();
  });

  it('should open the modal when the button is clicked', () => {
    render(<ModalWithBtn />);
    const button = screen.getByText('팝업');
    fireEvent.click(button);
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
  });

  it('should close the modal and call the onClose function when modal is closed', async () => {
    const mockOnClose = vi.fn();
    render(<ModalWithBtn onClose={mockOnClose} />);

    const button = screen.getByText('팝업');
    fireEvent.click(button);

    const modalCloseButton = screen.getByLabelText(/modal close button/i); // Assuming your modal has this label for its close button
    fireEvent.click(modalCloseButton);

    await waitFor(() => {
      const modal = screen.queryByRole('dialog');
      expect(modal).not.toBeInTheDocument();
    });

    expect(mockOnClose).toHaveBeenCalled();
  });
});
