import type { Meta } from '@storybook/react';
import { Tab, TabProps } from '@library-frontend/ui';
const meta = {
  title: 'Tab',
  component: Tab,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    componentSubtitle: '복수 컨텐츠를 분류하여 제공',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    header: {
      table: { type: { summary: 'string[]' } },
    },
    activeIndex: {
      table: { type: { summary: 'number' } },
    },
  },
  args: {
    header: ['1번', '2번', '3번'],
    activeIndex: 0,
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Tab>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const normal = ({ header, activeIndex }: TabProps) => {
  return (
    <Tab header={header} activeIndex={activeIndex}>
      <div>1번 컨텐츠</div>
      <div>2번 컨텐츠</div>
      <div>3번 컨텐츠</div>
    </Tab>
  );
};
