import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Table from './Table'; // 경로는 실제 경로에 맞게 변경해주세요

describe('Table component', () => {
  const sampleThead = ['Name', 'user'];
  const sampleTbody = [
    { id: '1', Name: 'Alice', user: '1231' },
    { id: '2', Name: 'Bob', user: '1231' },
  ];

  it('should render table headers correctly', () => {
    render(<Table thead={sampleThead} tbody={sampleTbody} />);
    sampleThead.forEach((head) => {
      expect(screen.getByText(head)).toBeInTheDocument();
    });
  });

  it('should render table body correctly', () => {
    render(<Table thead={sampleThead} tbody={sampleTbody} />);
    sampleTbody.forEach((row) => {
      expect(screen.getByText(row.Name)).toBeInTheDocument();
    });
  });

  it('should select all rows when select-all checkbox is clicked', () => {
    render(<Table thead={sampleThead} tbody={sampleTbody} hasSelect={true} />);
    const selectAllCheckbox = screen.getByLabelText('Select All'); // 가정: Select All 체크박스에 aria-label="Select All"이 설정되어 있음
    const checkboxList = screen.getAllByRole<HTMLInputElement>('checkbox'); // 가정: Select All 체크박스에 aria-label="Select All"이 설정되어 있음
    fireEvent.click(selectAllCheckbox);
    checkboxList.forEach((checkbox) => {
      expect(checkbox.checked).toBe(true);
    });
    fireEvent.click(selectAllCheckbox);
    checkboxList.forEach((checkbox) => {
      expect(checkbox.checked).toBe(false);
    });
  });
});
