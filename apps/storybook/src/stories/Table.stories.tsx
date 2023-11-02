import type { Meta } from '@storybook/react';
import { Button, Table, TableProps } from '@library-frontend/ui';
const meta = {
  title: 'Table',
  component: Table,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
    componentSubtitle: '표 형태로 데이터 출력',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    thead: {
      table: { type: { summary: 'string[]' } },
    },
    tbody: {
      table: {
        type: {
          summary: `{
          id:string;
          selected?: boolean;
          [key in thead]: string;
        }[]`,
        },
      },
    },
    hasSelect: {
      table: { type: { summary: 'boolean' } },
    },
    onEval: {
      table: { type: { summary: 'function' } },
    },
  },
  args: {
    thead: ['col-1', 'col-2', 'col-3'],
    tbody: [
      {
        id: 'a',
        'col-1': '1',
        'col-2': '2',
        'col-3': '3',
      },
      {
        id: 'b',
        'col-1': '4',
        'col-2': '5',
        'col-3': '6',
      },
    ],
    hasSelect: false,
    onEval: (x) => {
      alert(x);
    },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Table>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const normal = ({ tbody, thead, hasSelect }: TableProps) => {
  return (
    <>
      <Table tbody={tbody} thead={thead} hasSelect={hasSelect} />
      {hasSelect ? (
        <Button onClick={() => alert(JSON.stringify(tbody.filter((x) => x.selected)))}>체크박스 확인</Button>
      ) : null}
    </>
  );
};
