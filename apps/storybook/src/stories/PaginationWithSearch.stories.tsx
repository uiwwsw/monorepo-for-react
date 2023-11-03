import type { Meta } from '@storybook/react';
import { PaginationWithSearch, PaginationWithSearchProps } from '@library-frontend/ui';
const meta = {
  title: 'Pagination',
  component: PaginationWithSearch,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],

  args: {
    totalPageNum: 200,
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof PaginationWithSearch>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const withSearch = (props: PaginationWithSearchProps) => {
  return <PaginationWithSearch {...props} />;
};
