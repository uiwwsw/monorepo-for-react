import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  it('renders button with provided text', () => {
    render(<Button>Click Me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick only once even if clicked multiple times', async () => {
    const fn = vi.fn();

    render(
      <Button smoothLoading onClick={fn}>
        Click Me
      </Button>,
    );

    const button = screen.getByRole('button', { name: /click me/i });

    await act(async () => {
      for (let i = 0; i < 2; i++) {
        fireEvent.click(button);
      }
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('calls onClick when clicked', async () => {
    const fn = vi.fn();

    render(
      <Button smoothLoading={false} onClick={fn}>
        Click Me
      </Button>,
    );

    const button = screen.getByRole('button', { name: /click me/i });

    await act(async () => {
      for (let i = 0; i < 2; i++) {
        fireEvent.click(button);
      }
    });

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('does not call onClick when disabled', async () => {
    const fn = vi.fn();

    render(
      <Button onClick={fn} disabled>
        Click Me
      </Button>,
    );

    const button = screen.getByRole('button', { name: /click me/i });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(fn).toHaveBeenCalledTimes(0);
  });

  it('shows loading state when clicked', async () => {
    render(<Button>Click Me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });

    await act(async () => {
      fireEvent.click(button);
    });

    const spinner = screen.getByLabelText('spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('disables button during async event', async () => {
    const fn = vi.fn(async () => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    render(
      <Button smoothLoading={true} onClick={fn}>
        Click Me
      </Button>,
    );

    const button = screen.getByRole('button', { name: /click me/i });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(button).toBeDisabled();
  });

  it('enables button after async event completes', async () => {
    const fn = vi.fn(async () => {
      return new Promise((resolve) => setTimeout(resolve, 500));
    });

    render(<Button onClick={fn}>Click Me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });

    await act(async () => {
      fireEvent.click(button);
      await new Promise((resolve) => setTimeout(resolve, 600));
    });

    expect(button).not.toBeDisabled();
  });
});
