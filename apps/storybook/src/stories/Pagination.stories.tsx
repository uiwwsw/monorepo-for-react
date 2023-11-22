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
    totalPageNum: {
      table: { type: { summary: 'number' } },
    },
    currentPageIndex: {
      table: { type: { summary: 'number' } },
    },
    maxPageNum: {
      table: { type: { summary: 'number' } },
    },
    hasDoubleArrow: {
      table: { type: { summary: 'boolean' } },
    },
    startPage: {
      table: { type: { summary: 'number' } },
    },
  },
  args: {
    totalPageNum: 200,
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Pagination>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const normal = (props: PaginationProps) => {
  return <Pagination {...props} />;
};
