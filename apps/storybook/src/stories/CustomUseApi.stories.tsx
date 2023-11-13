import { useAnimate, useCounter } from '@library-frontend/ui';
import { useMemo } from 'react';
const meta = {
  title: 'custom/use-api',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],

  argTypes: {
    children: {
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    children: '내용',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UseCounter = () => {
  const counter = useCounter(60);
  const memo = useMemo(
    () =>
      Math.floor(counter / 60)
        .toString()
        .padStart(2, '0') +
      ':' +
      Math.floor(counter % 60)
        .toString()
        .padStart(2, '0'),
    [counter],
  );
  return <>타이머: {memo}</>;
};
