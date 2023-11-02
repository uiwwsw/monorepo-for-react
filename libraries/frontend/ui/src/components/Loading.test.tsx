import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loading from './Loading'; // 경로는 실제 경로에 맞게 변경해주세요
describe('Loading component', () => {
  it('renders Spinner when show prop is true', () => {
    render(<Loading show={true} />);

    // Spinner를 id나 data-testid 등으로 찾을 수 있다면 다음과 같이 사용할 수 있습니다.
    const spinner = screen.getByLabelText('spinner'); // 가정: Spinner 컴포넌트에 data-testid="spinner"가 설정되어 있음
    expect(spinner).toBeInTheDocument();
  });

  it('does not render Spinner when show prop is false', () => {
    render(<Loading show={false} />);

    // Spinner를 id나 data-testid 등으로 찾을 수 있다면 다음과 같이 사용할 수 있습니다.
    const spinner = screen.queryByTestId('spinner'); // 가정: Spinner 컴포넌트에 data-testid="spinner"가 설정되어 있음
    expect(spinner).not.toBeInTheDocument();
  });

  // 추가적으로 isShowing, isHiding 등의 상태에 따른 테스트를 추가할 수 있습니다.
  // 하지만 이러한 상태는 useSmoothContext hook에서 관리되므로, 해당 hook에 대한 테스트를 따로 작성하는 것도 좋은 방법입니다.
});
