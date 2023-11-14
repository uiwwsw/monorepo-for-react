import type { Meta } from '@storybook/react';
import { Button, Menu } from '@library-frontend/ui';
const meta = {
  title: 'Menu',
  component: Menu,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    componentSubtitle: '클릭 시 매뉴 제공',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    width: {
      table: { type: { summary: 'number' } },
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Menu>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const normal = () => {
  return (
    <Menu>
      <Button onClick={() => alert('1')}>1번버튼</Button>
      <Button onClick={() => alert('2')}>2번버튼</Button>
      <Button onClick={() => alert('3')}>3번버튼</Button>
      <Button onClick={() => alert('4')}>4번버튼</Button>
    </Menu>
  );
};
export const size = () => {
  return (
    <Menu width="30vw">
      <Button onClick={() => alert('1')}>1번버튼</Button>
      <Button onClick={() => alert('2')}>2번버튼</Button>
      <Button onClick={() => alert('3')}>3번버튼</Button>
      <Button onClick={() => alert('4')}>4번버튼</Button>
    </Menu>
  );
};
