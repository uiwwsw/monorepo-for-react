import type { Meta } from '@storybook/react';
import { Calendar, CalendarProps } from '@library-frontend/ui';
const meta = {
  title: 'Calendar',
  component: Calendar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    componentSubtitle: '달력',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    selectRange: {
      table: { type: { summary: 'boolean' } },
    },
    defaultValue: {
      table: { type: { summary: 'string|[string,string]' } },
    },
  },
  args: {
    defaultValue: undefined,
    selectRange: false,
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Calendar>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const normal = (props: CalendarProps) => {
  return <Calendar {...props} />;
};
