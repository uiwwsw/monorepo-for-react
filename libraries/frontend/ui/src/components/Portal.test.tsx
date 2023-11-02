import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Portal from './Portal'; // 실제 경로에 맞게 변경해주세요

describe('Portal component', () => {
  it('기본적으로 자식 요소를 document.body에 렌더링해야 합니다.', () => {
    const text = '포탈 내용';
    render(<Portal>{text}</Portal>);
    expect(document.body.textContent).toContain(text);
  });

  it('root prop가 제공되면 자식 요소를 해당 DOM 노드에 렌더링해야 합니다.', () => {
    const rootId = 'custom-root';
    const customRoot = document.createElement('div');
    customRoot.id = rootId;
    document.body.appendChild(customRoot);

    const text = '사용자 정의 포탈 내용';
    render(<Portal root={rootId}>{text}</Portal>);
    expect(customRoot.textContent).toContain(text);

    // Cleanup
    customRoot.remove();
  });

  it('root prop가 잘못된 경우에는 자식 요소를 document.body에 렌더링해야 합니다.', () => {
    const wrongRootId = 'non-existent-root';
    const text = '포탈 내용';
    render(<Portal root={wrongRootId}>{text}</Portal>);
    expect(document.body.textContent).toContain(text);
  });
});
