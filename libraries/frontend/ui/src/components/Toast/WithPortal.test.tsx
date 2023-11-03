import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ToastWithPortal from './WithPortal'; // 실제 경로에 맞게 변경해주세요
describe('<ToastWithPortal />', () => {
  // 기본 open 상태에 따라 토스트의 초기 렌더링 검사
  it('should render toast based on defaultOpen prop', () => {
    render(<ToastWithPortal open={true} />);
    const toast = screen.queryByRole('alert'); // role이 'alert'인가요? 맞는지 확인해주세요.
    expect(toast).toBeInTheDocument();
  });
  it('should render toast based on defaultOpen prop', () => {
    render(<ToastWithPortal open={false} />);
    const toast = screen.queryByRole('alert');
    expect(toast).not.toBeInTheDocument();
  });

  // 토스트 닫기 버튼 클릭시 onClose 콜백이 호출되는지 검사
  it('should call onClose callback when toast is closed', () => {
    const handleClose = vi.fn();

    render(<ToastWithPortal duration={Infinity} open={true} onClose={handleClose} />);
    const closeBtn = screen.getByRole('button'); // 닫기 버튼의 role을 기반으로 선택하였습니다. 수정이 필요할 수 있습니다.
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // // 토스트가 완전히 닫힌 후 onClosed 콜백이 호출되는지 검사
  // it('should call onClosed callback after toast is completely closed', async () => {
  //   const handleClosed = vi.fn();

  //   render(<ToastWithPortal open={true} onClosed={handleClosed} />);
  //   const closeBtn = screen.getByRole('button');
  //   fireEvent.click(closeBtn);

  //   await waitFor(() => {
  //     expect(handleClosed).toHaveBeenCalledTimes(1);
  //   });
  // });

  // ... 추가적인 테스트 케이스 ...
});
