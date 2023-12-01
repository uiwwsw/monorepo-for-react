import type { Meta } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { ToastWithPortal, ToastWithPortalProps } from '@library-frontend/ui';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Toast',
  component: ToastWithPortal,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    open: true,
    duration: 3000,
    children: '토스트 내용',
    notClosed: false,
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  // argTypes: {
  //   open: {
  //     control: { type: 'boolean' },
  //   },
  // },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof ToastWithPortal>;

export default meta;
const div = document.createElement('div');
div.id = 'toast';
document.body.appendChild(div);
export const toastWithPortal = ({ children, open, ...props }: ToastWithPortalProps) => {
  const [_, updateArgs] = useArgs();
  return (
    <ToastWithPortal {...props} open={open} onClose={() => updateArgs({ open: false })}>
      {children}
    </ToastWithPortal>
  );
};
