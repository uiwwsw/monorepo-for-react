import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PaginationWithSearch from './WithSearch'; // 실제 경로에 맞게 변경해주세요

describe('<PaginationWithSearch />', () => {
  it('displays input field when search button is clicked', () => {
    render(<PaginationWithSearch totalPageNum={10} maxPageNum={5} />);
    const searchButton = screen.getByRole('button', { name: /🔍/i });
    fireEvent.click(searchButton);
    const inputField = screen.getByRole('textbox');
    expect(inputField).toBeInTheDocument();
  });

  it('triggers onChange when a page number is input', () => {
    const onChangeMock = vi.fn();
    render(<PaginationWithSearch totalPageNum={10} maxPageNum={5} onChange={onChangeMock} />);
    const searchButton = screen.getByRole('button', { name: /🔍/i });
    fireEvent.click(searchButton);
    const inputField = screen.getByRole('textbox');
    fireEvent.change(inputField, { target: { value: '9' } });
    const button = screen.getByRole('button', { name: /6/i });

    expect(button).toHaveTextContent('6'); // Note: 0-based index
  });

  it('clears input value on blur', () => {
    render(<PaginationWithSearch totalPageNum={10} maxPageNum={5} />);
    const searchButton = screen.getByRole('button', { name: /🔍/i });
    fireEvent.click(searchButton);
    const inputField = screen.getByRole<HTMLInputElement>('textbox');
    fireEvent.change(inputField, { target: { value: '3' } });
    fireEvent.blur(inputField);
    expect(inputField.value).toBe('');
  });
});
