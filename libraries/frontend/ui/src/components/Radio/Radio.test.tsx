import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RadioGroup from './Group'; // 경로는 실제 경로에 맞게 변경해주세요

describe('Radio component', () => {
  it('should change active radio button when clicked', async () => {
    render(<RadioGroup id="a" labels={['A', 'B']}></RadioGroup>);
    const buttons = screen.queryAllByRole('radio');
    const button0 = buttons[0] as HTMLInputElement;
    const button1 = buttons[1] as HTMLInputElement;
    fireEvent.click(button0);
    expect(button0.checked).toBe(true);
    expect(button1.checked).toBe(false);
    fireEvent.click(button1);
    expect(button0.checked).toBe(false);
    expect(button1.checked).toBe(true);
  });
});
