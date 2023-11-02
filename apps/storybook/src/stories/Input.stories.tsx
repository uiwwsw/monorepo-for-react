import type { Meta } from '@storybook/react';
import { Input, InputProps } from '@library-frontend/ui';
import { ChangeEvent, MouseEvent, useMemo, useState } from 'react';
const meta = {
  title: 'Input',
  component: Input,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    componentSubtitle: '타이핑하는 영역',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    type: {
      table: { type: { summary: 'text, number, search, password' } },
    },
    error: {
      table: { type: { summary: 'boolean' } },
    },
    value: {
      table: { type: { summary: 'string' } },
    },
    placeholder: {
      table: { type: { summary: 'string' } },
    },
  },
  args: {
    error: false,
    value: '기본값',
    placeholder: '내용을 입력하세요.',
    type: 'text',
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Input>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const readonly = ({ error, value, placeholder, readOnly = true }: InputProps) => {
  return <Input value={value} error={error} placeholder={placeholder} readOnly={readOnly} />;
};
export const change = ({ value, error }: InputProps) => {
  const [text, setText] = useState('');
  return (
    <>
      <Input defaultValue={value} error={error} onChange={(e) => setText(e.target.value)} />
      <br />
      <br />
      <br />
      <br />
      text:{text}
    </>
  );
};
export const search = ({ error, value, placeholder }: InputProps) => {
  const [keyword, setKeyword] = useState('');
  const data = useMemo(
    () =>
      [
        { name: '김지원', age: 24, location: '서울' },
        { name: '이성호', age: 35, location: '부산' },
        { name: '박민지', age: 29, location: '대구' },
        { name: '최연우', age: 40, location: '인천' },
        { name: '정대현', age: 31, location: '광주' },
        { name: '한슬기', age: 28, location: '대전' },
        { name: '문진호', age: 45, location: '울산' },
        { name: '강하영', age: 22, location: '제주' },
        { name: '오태양', age: 33, location: '성남' },
        { name: '류지수', age: 26, location: '수원' },
        { name: '임재혁', age: 38, location: '창원' },
      ].filter((x) => Object.values(x).some((k) => k.toString().indexOf(keyword) !== -1)),
    [keyword],
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setKeyword(e.currentTarget.value);

  return (
    <>
      <Input type="search" onChange={handleChange} defaultValue={keyword} error={error} placeholder={placeholder} />
      <div>
        {data.map((x) => (
          <p>{`이름:${x.name} 나이:${x.age} 사는곳:${x.location}`}</p>
        ))}
      </div>
    </>
  );
};
