import type { Meta } from '@storybook/react';
import { Skeleton, SkeletonProps } from '@library-frontend/ui';
const meta = {
  title: 'Skeleton',
  component: Skeleton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    componentSubtitle: '로딩중인 영역의 구조를 보여줌으로 프로세스가 작동중임을 알려줌',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    col: {
      table: { type: { summary: 'string' } },
    },
  },
  args: {
    col: '6rem 6rem',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Skeleton>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const circle = ({ col }: SkeletonProps) => {
  return (
    <Skeleton col={col} className="border p-3">
      <div className="w-full h-24 rounded-full row-span-2"></div>
      <div className="w-full h-12"></div>
      <div className="w-full h-12"></div>
      <div className="w-full h-2"></div>
      <div className="w-full h-2"></div>
      <div className="w-full h-2"></div>
      <div className="w-full h-2"></div>
    </Skeleton>
  );
};
