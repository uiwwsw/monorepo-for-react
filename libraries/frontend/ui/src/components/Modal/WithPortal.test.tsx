import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ModalWithPortal from './WithPortal'; // 실제 경로에 맞게 변경해주세요

describe('<ModalWithPortal />', () => {
  it('open이 false일 때 모달이 DOM에 없어야 함', () => {
    render(<ModalWithPortal open={false} />);
    const modal = screen.queryByRole('dialog');
    expect(modal).not.toBeInTheDocument();
  });

  it('open이 true일 때 모달이 DOM에 존재해야 함', async () => {
    render(<ModalWithPortal open={true} />);
    const modal = screen.getByRole('dialog');
    await waitFor(() => expect(modal).toBeInTheDocument());
  });

  it('hasButton에 따라 버튼이 노출되야함 1/3', async () => {
    render(<ModalWithPortal open={true} hasButton={[]} />);
    const closeButton = screen.queryByLabelText(/modal close button/i); // '닫기' 텍스트나 적절한 역할/라벨로 변경해야 할 수 있음
    const yesButton = screen.queryByText(/확인/i); // '닫기' 텍스트나 적절한 역할/라벨로 변경해야 할 수 있음
    const cancelButton = screen.queryByText(/취소/i); // '닫기' 텍스트나 적절한 역할/라벨로 변경해야 할 수 있음
    await waitFor(() => expect(closeButton).not.toBeInTheDocument());
    await waitFor(() => expect(yesButton).not.toBeInTheDocument());
    await waitFor(() => expect(cancelButton).not.toBeInTheDocument());
  });
  it('hasButton에 따라 버튼이 노출되야함 2/3', async () => {
    render(<ModalWithPortal open={true} hasButton={['NONE']} />);
    const closeButton = screen.queryByLabelText(/modal close button/i); // '닫기' 텍스트나 적절한 역할/라벨로 변경해야 할 수 있음
    const yesButton = screen.queryByText(/확인/i); // '닫기' 텍스트나 적절한 역할/라벨로 변경해야 할 수 있음
    const cancelButton = screen.queryByText(/취소/i); // '닫기' 텍스트나 적절한 역할/라벨로 변경해야 할 수 있음
    await waitFor(() => expect(closeButton).toBeInTheDocument());
    await waitFor(() => expect(yesButton).not.toBeInTheDocument());
    await waitFor(() => expect(cancelButton).not.toBeInTheDocument());
  });
  it('hasButton에 따라 버튼이 노출되야함 3/3', async () => {
    render(<ModalWithPortal open={true} hasButton={['OK', 'CANCEL']} />);
    const closeButton = screen.queryByLabelText(/modal close button/i); // '닫기' 텍스트나 적절한 역할/라벨로 변경해야 할 수 있음
    const yesButton = screen.queryByText(/확인/i); // '닫기' 텍스트나 적절한 역할/라벨로 변경해야 할 수 있음
    const cancelButton = screen.queryByText(/취소/i); // '닫기' 텍스트나 적절한 역할/라벨로 변경해야 할 수 있음
    await waitFor(() => expect(closeButton).not.toBeInTheDocument());
    await waitFor(() => expect(yesButton).toBeInTheDocument());
    await waitFor(() => expect(cancelButton).toBeInTheDocument());
  });

  it('닫기 버튼 클릭 시 모달이 닫혀야 함', async () => {
    const handleClose = vi.fn(); // jest의 mock function을 사용하여 닫기 로직을 mock 처리합니다.

    render(<ModalWithPortal open={true} onClose={handleClose} />);
    const closeButton = screen.queryByLabelText(/modal close button/i); // '닫기' 텍스트나 적절한 역할/라벨로 변경해야 할 수 있음
    await waitFor(() => expect(closeButton).toBeInTheDocument());
    await fireEvent.click(closeButton!);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
