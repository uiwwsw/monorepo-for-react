import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Combo from './Combo';

describe('Combo component', () => {
  it('should render correctly', () => {
    render(<Combo placeholder="Select an option" />);
    const comboElement = screen.getByRole('combobox');
    expect(comboElement).toBeInTheDocument();
  });

  it('should display options when combo is opened and select the first option when clicked', () => {
    const mockOnSelect = vi.fn();
    render(
      <Combo
        placeholder="Select an option"
        options={[
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ]}
        onChange={mockOnSelect}
      />,
    );
    const comboElement = screen.getByRole('combobox');
    fireEvent.click(comboElement);
    const optionsList = screen.getByRole('list');
    const optionElement = optionsList.querySelectorAll('button')[0];
    fireEvent.click(optionElement);
    expect(mockOnSelect).toHaveBeenCalledWith('option1');
  });

  it('should filter options when searching and select the first matched option when clicked', () => {
    const mockOnSelect = vi.fn();
    render(
      <Combo
        placeholder="Select an option"
        options={[
          { value: 'banana', label: 'Banana' },
          { value: 'orange', label: 'Orange' },
          { value: 'apple', label: 'Apple' },
        ]}
        onChange={mockOnSelect}
      />,
    );
    const searchInput = screen.getByRole('search');
    fireEvent.change(searchInput, { target: { value: 'Ap' } });
    const optionsList = screen.getByRole('list');
    const optionElement = optionsList.querySelectorAll('button')[0];
    fireEvent.click(optionElement);
    expect(mockOnSelect).toHaveBeenCalledWith('apple');
  });
});
