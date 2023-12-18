import type { Meta } from '@storybook/react';
import { Pagination, PaginationProps } from '@library-frontend/ui';
const meta = {
  title: 'Pagination',
  component: Pagination,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    componentSubtitle: '페이지네이션',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    max: {
      table: { type: { summary: 'number' } },
    },
    index: {
      table: { type: { summary: 'number' } },
    },
    per: {
      table: { type: { summary: 'number' } },
    },
  },
  args: {
    max: 200,
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Pagination>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
const toast = document.createElement('div');
toast.id = 'toast';
document.body.appendChild(toast);
export const normal = (props: PaginationProps) => {
  return <Pagination {...props} />;
};
