import type { Meta } from '@storybook/react';
import { Combo, ComboProps } from '@library-frontend/ui';
const meta = {
  title: 'Combo',
  component: Combo,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    componentSubtitle: '커스터마이징 셀렉트박스',
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
    defaultValue: {
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
} satisfies Meta<typeof Combo>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const normal = ({ error, options }: ComboProps) => {
  return <Combo error={error} options={options} onChange={(x) => alert(x)} />;
};
