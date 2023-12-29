import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Checkbox from '.'; // 경로는 실제 경로에 맞게 변경해주세요

describe('Checkbox component', () => {
  it('should render a checkbox', () => {
    render(<Checkbox />);
    const checkboxInput = screen.getByRole('checkbox');
    expect(checkboxInput).toBeInTheDocument();
  });

  it('should toggle checkbox state when clicked', () => {
    render(<Checkbox />);
    const checkboxInput = screen.getByRole('checkbox') as HTMLInputElement;

    expect(checkboxInput.checked).toBe(false); // 초기 상태 확인

    fireEvent.click(checkboxInput);
    expect(checkboxInput.checked).toBe(true); // 체크된 상태 확인

    fireEvent.click(checkboxInput);
    expect(checkboxInput.checked).toBe(false); // 다시 체크 해제된 상태 확인
  });

  // props를 전달할 경우에 대한 테스트를 추가할 수 있습니다.
  it('should be disabled when the disabled prop is true', () => {
    render(<Checkbox disabled />);
    const checkboxInput = screen.getByRole('checkbox');
    expect(checkboxInput).toBeDisabled();
  });

  it('should have label when the label prop is there', () => {
    render(<Checkbox>test</Checkbox>);
    const label = screen.getByRole('textbox');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('test');
  });
});
