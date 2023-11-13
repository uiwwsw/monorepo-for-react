import { useCounter } from '@library-frontend/ui';
import { useMemo } from 'react';
const meta = {
  title: 'custom/use-api',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],

  argTypes: {
    children: {
      timer: {
        type: { summary: 'number' },
      },
    },
  },
  args: {
    timer: 6,
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UseCounter = ({ timer }: { timer: number }) => {
  const { increase, decrease, done } = useCounter(timer);
  const memo2 = useMemo(
    () =>
      Math.floor(decrease / 60)
        .toString()
        .padStart(2, '0') +
      ':' +
      Math.floor(decrease % 60)
        .toString()
        .padStart(2, '0'),
    [decrease],
  );
  const memo = useMemo(
    () =>
      Math.floor(increase / 60)
        .toString()
        .padStart(2, '0') +
      ':' +
      Math.floor(increase % 60)
        .toString()
        .padStart(2, '0'),
    [increase],
  );
  return (
    <>
      <p>타이머: {done ? '완료' : memo}</p>
      <p>타이머: {done ? '완료' : memo2}</p>
    </>
  );
};
