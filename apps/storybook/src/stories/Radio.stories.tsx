import type { Meta } from '@storybook/react';
import { RadioGroup, RadioGroupProps } from '@library-frontend/ui';
const meta = {
  title: 'RadioGroup',
  component: RadioGroup,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    componentSubtitle: '달력',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    labels: {
      table: { type: { summary: 'string[]' } },
    },
    defaultChecked: {
      table: { type: { summary: 'number' } },
    },
  },
  args: {
    labels: ['한글', '영어', '일본어'],
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof RadioGroup>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const normal = (props: RadioGroupProps) => {
  return <RadioGroup {...props} />;
};
