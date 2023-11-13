import type { Meta } from '@storybook/react';
import { createLogger, wait } from '@package-frontend/utils';
import { Button, ButtonProps, sizes, colors } from '@library-frontend/ui';
const logger = createLogger('button');
const meta = {
  title: 'Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
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
    themeSize: {
      table: { type: { summary: sizes } },
    },
    themeColor: {
      table: { type: { summary: colors } },
    },
  },
  args: {
    disabled: false,
    themeColor: 'primary',
    themeSize: 'md',
    smoothLoading: true,
    onClick: async () => {
      await wait();
      alert('클릭됨');
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const custom = ({ disabled, onClick, smoothLoading, ...props }: ButtonProps) => {
  return (
    <Button {...props} onClick={onClick} smoothLoading={smoothLoading} disabled={disabled}>
      안녕
    </Button>
  );
};
export const block = ({ disabled, onClick, smoothLoading, ...props }: ButtonProps) => {
  return (
    <Button className="w-full" {...props} onClick={onClick} smoothLoading={smoothLoading} disabled={disabled}>
      안녕
    </Button>
  );
};
