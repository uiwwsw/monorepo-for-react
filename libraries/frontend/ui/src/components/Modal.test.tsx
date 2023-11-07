import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal, { ModalResult } from './Modal/Base'; // 실제 경로에 맞게 변경해주세요

describe('Modal component', () => {
  it('should render modal when open prop is true', () => {
    render(<Modal open={true} />);
    const modalContent = screen.getByRole('dialog');
    expect(modalContent).toBeInTheDocument();
  });

  it('should call onClose function when OK button is clicked', async () => {
    const mockOnEval = vi.fn();
    render(<Modal open={true} onClose={mockOnEval} />);
    const okButton = screen.getByRole('button', { name: /ok/i });
    fireEvent.click(okButton);
    expect(mockOnEval).toHaveBeenCalledWith('OK' as ModalResult);
  });

  it('should call onClose function with CANCEL when Cancel button is clicked', () => {
    const mockOnEval = vi.fn();
    render(<Modal open={true} onClose={mockOnEval} />);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(mockOnEval).toHaveBeenCalledWith('CANCEL' as ModalResult);
  });

  // it('hideClose props는 클로즈버튼을 노출하지 않습니다.', () => {
  //   render(<Modal open={true} hideClose={true} />);
  //   const closeButton = screen.queryByLabelText('modal close button');
  //   expect(closeButton).not.toBeInTheDocument();
  // });

  it('persist props true는 레이어 클릭 시 닫을 수 없습니다.', () => {
    const mockOnClose = vi.fn();
    render(<Modal open={true} persist={true} />);
    const overlay = screen.getByLabelText('modal back overlay');
    fireEvent.click(overlay);

    // persist가 true이면 onClose 함수가 호출되지 않아야 합니다.
    expect(mockOnClose).not.toHaveBeenCalled();

    // persist가 true이므로 모달은 계속 화면에 보여야 합니다.
    const modalContent = screen.getByRole('dialog');
    expect(modalContent).toBeInTheDocument();
  });

  it('오픈되지 않은 모달은 기능을 수행할 수 없습니다.', () => {
    const mockOnEval = vi.fn();
    render(<Modal open={false} onClose={mockOnEval} />);
    const okButton = screen.getByRole('button', { name: /ok/i });
    fireEvent.click(okButton);
    expect(mockOnEval).not.toHaveBeenCalled();
  });
});
