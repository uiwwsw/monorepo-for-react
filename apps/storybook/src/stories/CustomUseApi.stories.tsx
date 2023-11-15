import { Spinner, useCounter, useInfiniteScroll } from '@library-frontend/ui';
import { wait } from '@package-frontend/utils';
import { useEffect, useMemo, useState } from 'react';
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

export const UseInfiniteScroll = () => {
  const [data, setData] = useState<number[]>([0]);
  const [loading, setLoading] = useState(false);
  const scrollDeps = useInfiniteScroll();
  const action = async () => {
    setLoading(true);
    await wait(1000);
    setData((prev) => [...prev, prev.length]);
    setLoading(false);
  };
  useEffect(() => {
    if (!scrollDeps) return; // mount 시 실행여부

    action();
  }, [scrollDeps]);
  return (
    <div>
      {data.map((x) => (
        <div key={x} className="h-[150vh] bg-slate-400 text-9xl flex items-center justify-center">
          <span>{x}</span>
        </div>
      ))}
      {loading && (
        <span className="fixed inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      )}
    </div>
  );
};
