import type { Meta } from '@storybook/react';
import { ToastWithBtn, ToastWithBtnProps, sizes, themes } from '@library-frontend/ui';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Toast',
  component: ToastWithBtn,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    componentSubtitle: '메세지를 노출함',
  },
  tags: ['autodocs'],
  argTypes: {
    btnName: {
      table: {
        type: { summary: 'string' },
      },
      // description: '버튼 텍스트',
    },
    duration: {
      table: {
        type: { summary: 'number' },
      },
    },
    children: {
      table: {
        type: { summary: 'string' },
      },
    },
    btnSize: {
      table: { type: { summary: sizes } },
    },
    btnTheme: {
      table: { type: { summary: themes } },
    },
  },
  args: {
    btnName: '버튼',
    duration: 3000,
    children: '토스트 내용',
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
} satisfies Meta<typeof ToastWithBtn>;

export default meta;
const div = document.createElement('div');
div.id = 'toast';
document.body.appendChild(div);
export const toastWithBtn = ({ children, ...props }: ToastWithBtnProps) => {
  return <ToastWithBtn {...props}>{children}</ToastWithBtn>;
};
