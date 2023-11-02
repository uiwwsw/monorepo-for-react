import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Input from './Input';

describe('Input component', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    const inputElement = screen.getByPlaceholderText('Enter text');
    expect(inputElement).toBeInTheDocument();
  });

  it('handles user input correctly', () => {
    render(<Input placeholder="Enter text" />);
    const inputElement = screen.getByPlaceholderText<HTMLInputElement>('Enter text');

    fireEvent.change(inputElement, { target: { value: 'some text' } });
    expect(inputElement.value).toBe('some text');
  });

  it('accepts passed props', () => {
    render(<Input placeholder="Enter text" disabled />);
    const inputElement = screen.getByPlaceholderText('Enter text');
    expect(inputElement).toBeDisabled();
  });

  it('ignores user input when disabled', () => {
    render(<Input placeholder="Enter text" value="another text" disabled />);
    const inputElement = screen.getByPlaceholderText<HTMLInputElement>('Enter text');
    fireEvent.change(inputElement, { target: { value: 'some text' } });
    expect(inputElement.value).toBe('another text');
  });
});
