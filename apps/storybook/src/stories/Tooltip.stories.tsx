import type { Meta } from '@storybook/react';
import { Tooltip, TooltipProps } from '@library-frontend/ui';
const meta = {
  title: 'Tooltip',
  component: Tooltip,
  parameters: {
    componentSubtitle: '마우스오버시 텍스트 노출',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],

  argTypes: {
    children: {
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    children: '내용',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Tooltip>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const normal = ({ children }: TooltipProps) => {
  return <Tooltip>{children}</Tooltip>;
};
