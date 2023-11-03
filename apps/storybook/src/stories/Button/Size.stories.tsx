import type { Meta } from '@storybook/react';
import { createLogger, wait } from '@package-frontend/utils';
import { Button, ButtonProps } from '@library-frontend/ui';
const meta = {
  title: 'Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    componentSubtitle: '클릭 시 기능을 수행',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    disabled: {
      table: { type: { summary: 'boolean' } },
    },
    smoothLoading: {
      table: { type: { summary: 'boolean' } },
    },
    onClick: {
      table: { type: { summary: 'function' } },
    },
  },
  args: {
    disabled: false,
    smoothLoading: true,
    onClick: async () => {
      await wait();
      alert('클릭됨');
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const xl = ({ themeSize = 'xl', disabled, onClick, smoothLoading, ...props }: ButtonProps) => {
  return (
    <Button {...props} themeSize={themeSize} onClick={onClick} smoothLoading={smoothLoading} disabled={disabled}>
      안녕
    </Button>
  );
};
export const md = ({ themeSize = 'md', disabled, onClick, smoothLoading, ...props }: ButtonProps) => {
  return (
    <Button {...props} themeSize={themeSize} onClick={onClick} smoothLoading={smoothLoading} disabled={disabled}>
      안녕
    </Button>
  );
};
export const sm = ({ themeSize = 'sm', disabled, onClick, smoothLoading, ...props }: ButtonProps) => {
  return (
    <Button {...props} themeSize={themeSize} onClick={onClick} smoothLoading={smoothLoading} disabled={disabled}>
      안녕
    </Button>
  );
};
