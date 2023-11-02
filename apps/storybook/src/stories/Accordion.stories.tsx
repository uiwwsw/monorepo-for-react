import type { Meta } from '@storybook/react';
import { Accordion, AccordionProps } from '@library-frontend/ui';
const meta = {
  title: 'Accordion',
  component: Accordion,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    componentSubtitle: '클릭 시 숨겨놓은 정보를 제공',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    title: {
      table: { type: { summary: 'string' } },
    },
    children: {
      table: { type: { summary: ['string', 'ReactNode'] } },
    },
  },
  args: {
    title: '타이틀',
    children: '숨겨놓을 컨텐츠',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Accordion>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const normal = ({ title, children }: AccordionProps) => {
  return <Accordion title={title}>{children}</Accordion>;
};
