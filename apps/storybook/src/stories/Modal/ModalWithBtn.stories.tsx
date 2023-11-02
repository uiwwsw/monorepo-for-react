import type { Meta } from '@storybook/react';

import { ModalWithBtn, ModalWithBtnProps, sizes, themes } from '@library-frontend/ui';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Modal',
  component: ModalWithBtn,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    componentSubtitle: '전체 화면의 조작을 제한하고 답변을 받음',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      description: '팝업 노출 여부',
    },
    hasToast: {
      description: 'modal 내부 이벤트 오류 시 토스트 노출 여부. 현재는 테스트 목적으로 true 일때 강제로 에러 발생중',
    },
    smoothLoading: {
      description: '내부 버튼 속성',
    },
    btnName: {
      table: { type: { summary: 'string' } },
    },
    btnSize: {
      table: { type: { summary: sizes } },
    },
    btnTheme: {
      table: { type: { summary: themes } },
    },
  },
  args: {
    open: true,
    hasToast: false,
    smoothLoading: true,
    btnName: '팝업',
    btnSize: 'md',
    btnTheme: 'primary',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  // argTypes: {
  //   open: {
  //     control: { type: 'boolean' },
  //   },
  // },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof ModalWithBtn>;

export default meta;
const toast = document.createElement('div');
const modal = document.createElement('div');
toast.id = 'toast';
modal.id = 'modal';
document.body.appendChild(toast);
document.body.appendChild(modal);
export const modalWithBtn = ({ btnName, ...props }: ModalWithBtnProps) => {
  return (
    <ModalWithBtn {...props} btnName={btnName}>
      팝업내용
    </ModalWithBtn>
  );
};
export const modalWithBtnHasError = ({ btnName, hasToast, ...props }: ModalWithBtnProps) => {
  const onEval = async () => {
    if (hasToast) throw new Error('dwdaw');
  };
  return (
    <ModalWithBtn {...props} hasToast={hasToast} onEval={onEval} btnName={btnName}>
      팝업내용
    </ModalWithBtn>
  );
};
