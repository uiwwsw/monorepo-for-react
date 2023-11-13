import type { Meta } from '@storybook/react';
import { Select, SelectProps } from '@library-frontend/ui';
const meta = {
  title: 'Select',
  component: Select,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    componentSubtitle: '클릭 시 보기 제공',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    error: {
      table: { type: { summary: 'string[]' } },
    },
    options: {
      table: {
        type: { summary: '{value: string; label: string; hidden?: boolean; disabled?: boolean}[]' },
      },
    },
    placeholder: {
      table: { type: { summary: 'string' } },
    },
    value: {
      table: { type: { summary: 'string' } },
    },
  },
  args: {
    error: false,
    options: [
      {
        label: '선택지1',
        value: '1',
      },
      {
        label: '선택지2',
        value: '2',
        hidden: true,
      },
      {
        label: '선택지3',
        value: '3',
      },
      {
        label: '선택지4',
        value: '4',
        disabled: true,
      },
    ],
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Select>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const normal = ({ error, options }: SelectProps) => {
  return <Select error={error} options={options} onChange={(x) => alert(x.target.value)} />;
};
export const block = ({ error, options }: SelectProps) => {
  return <Select className="w-full" error={error} options={options} onChange={(x) => alert(x.target.value)} />;
};
