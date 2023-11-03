import type { Meta } from '@storybook/react';

import { ModalWithPortal, ModalWithPortalProps } from '@library-frontend/ui';
import { useArgs } from '@storybook/preview-api';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Modal',
  component: ModalWithPortal,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  args: {
    open: true,
    hasToast: false,
    smoothLoading: true,
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  // argTypes: {
  //   open: {
  //     control: { type: 'boolean' },
  //   },
  // },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof ModalWithPortal>;

export default meta;
const toast = document.createElement('div');
const modal = document.createElement('div');
toast.id = 'toast';
modal.id = 'modal';
document.body.appendChild(toast);
document.body.appendChild(modal);
export const modalWithPortalHasError = ({ open, hasToast, ...props }: ModalWithPortalProps) => {
  const [_, updateArgs] = useArgs(); // onChange를 콜해야하나, 스토리에서는 컨트롤 값 동기화 처리
  const onClose = async () => {
    if (hasToast) throw new Error('오류 발생');
    else updateArgs({ open: !open });
  };
  return (
    <ModalWithPortal {...props} hasToast={hasToast} onClose={onClose} open={open}>
      팝업내용
    </ModalWithPortal>
  );
};
