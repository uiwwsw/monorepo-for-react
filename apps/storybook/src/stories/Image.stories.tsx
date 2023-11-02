import type { Meta } from '@storybook/react';

import { Image, ImageProps } from '@library-frontend/ui';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Image',
  component: Image,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    componentSubtitle: '이미지 출력',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      table: { type: { summary: 'number' } },
    },
    height: {
      table: { type: { summary: 'number' } },
    },
    src: {
      table: { type: { summary: 'string' } },
    },
  },
  args: {
    src: 'https://source.unsplash.com/random/300×300​',
    width: 300,
    height: 300,
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
} satisfies Meta<typeof Image>;

export default meta;

export const load = (props: ImageProps) => {
  return <Image {...props} />;
};
export const error = (props: ImageProps) => {
  return <Image {...props} src="djawkldjlawkdjlaghk" />;
};
