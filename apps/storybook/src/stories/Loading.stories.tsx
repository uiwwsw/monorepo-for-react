import type { Meta } from '@storybook/react';

import { Image, Loading, LoadingProps } from '@library-frontend/ui';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Loading',
  component: Loading,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    componentSubtitle: '화면의 조작을 제한',
  },
  tags: ['autodocs'],
  argTypes: {
    show: {
      table: { type: { summary: 'boolean' } },
    },
  },
  args: {
    show: true,
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  // argTypes: {
  //   open: {
  //     control: { type: 'boolean' },
  //   },
  // },
  // args: {
  //   open: true
  // }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Loading>;

export default meta;

export const normal = ({ show }: LoadingProps) => {
  return (
    <div>
      <Image width={500} height={500} src="/test.jfif" />
      <Loading show={show} />
    </div>
  );
};
