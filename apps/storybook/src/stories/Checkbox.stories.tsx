import type { Meta } from '@storybook/react';
import { Checkbox, CheckboxProps } from '@library-frontend/ui';
import { useState } from 'react';
const meta = {
  title: 'Checkbox',
  component: Checkbox,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    componentSubtitle: '체크박스',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    checked: {
      table: { type: { summary: 'boolean' } },
    },
  },
  args: {
    checked: true,
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Checkbox>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const readonly = ({ checked, readOnly = true }: CheckboxProps) => {
  return <Checkbox checked={checked} readOnly={readOnly} />;
};
export const change = ({ checked }: CheckboxProps) => {
  const [on, setOn] = useState(checked);

  return (
    <>
      <Checkbox defaultChecked={checked} onChange={(e) => setOn(e.target.checked)} />
      <br />
      <br />
      <br />
      <br />
      <br />
      checked: {on ? 'on' : 'off'}
    </>
  );
};
