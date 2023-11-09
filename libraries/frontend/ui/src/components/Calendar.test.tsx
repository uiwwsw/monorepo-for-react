import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Calendar from './Calendar'; // 실제 경로에 맞게 변경해주세요

describe('Calendar component', () => {
  it('should display default value for date selection', () => {
    render(<Calendar />);
    const button = screen.getByRole('button', { name: /날짜를 선택해주세요\./i });
    expect(button).toBeInTheDocument();
  });

  it('should open calendar on button click', () => {
    render(<Calendar />);
    const button = screen.getByRole('button', { name: /날짜를 선택해주세요\./i });
    fireEvent.click(button);
    const calendarElement = screen.getByLabelText('react-calendar');
    expect(calendarElement).toBeInTheDocument();
  });
});
