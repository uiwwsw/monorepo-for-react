import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from './'; // 실제 경로에 맞게 변경해주세요

describe('<Pagination />', () => {
  it('renders the correct number of pages based on max and per', () => {
    render(<Pagination max={10} per={5} />);
    const pageButtons = screen.getAllByRole('button', { name: /^[\d]+$/ });
    expect(pageButtons).toHaveLength(5);
  });

  it('triggers onChange with the correct page number when a page is clicked', () => {
    const onChangeMock = vi.fn();
    render(<Pagination max={10} per={5} onChange={onChangeMock} />);
    const thirdPageButton = screen.getByRole('button', { name: '3' });
    fireEvent.click(thirdPageButton);
    expect(onChangeMock).toHaveBeenCalledWith(2); // Note: 0-based index
  });

  it('navigates to the next set of pages when the right arrow is clicked', () => {
    render(<Pagination max={10} per={5} index={2} />);
    const rightArrowButton = screen.getByRole('button', { name: '❯' });
    fireEvent.click(rightArrowButton);
    const firstPageInNextSet = screen.getByRole('button', { name: '6' });
    expect(firstPageInNextSet).toBeInTheDocument();
  });

  it('navigates to the previous set of pages when the left arrow is clicked', () => {
    render(<Pagination max={10} per={5} index={7} />);
    const leftArrowButton = screen.getByRole('button', { name: '❮' });
    fireEvent.click(leftArrowButton);
    const firstPageInPreviousSet = screen.getByRole('button', { name: '1' });
    expect(firstPageInPreviousSet).toBeInTheDocument();
  });

  it('navigates to the first page when the double left arrow is clicked', () => {
    render(<Pagination max={10} per={5} index={7} />);
    const doubleLeftArrowButton = screen.getByRole('button', { name: '❮❮' });
    fireEvent.click(doubleLeftArrowButton);
    const firstPageButton = screen.getByRole('button', { name: '1' });
    expect(firstPageButton).toHaveClass('bg-indigo-500'); // Assumes that the selected button has this class
  });

  it('navigates to the last page when the double right arrow is clicked', () => {
    render(<Pagination max={10} per={5} index={2} />);
    const doubleRightArrowButton = screen.getByRole('button', { name: '❯❯' });
    fireEvent.click(doubleRightArrowButton);
    const lastPageButton = screen.getByRole('button', { name: '10' });
    expect(lastPageButton).toHaveClass('bg-indigo-500'); // Assumes that the selected button has this class
  });
});
