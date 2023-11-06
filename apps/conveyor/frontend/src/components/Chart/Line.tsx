import { createLogger } from '@package-frontend/utils';
import { ResponsiveLine } from '@nivo/line';
/* ======   interface   ====== */
export interface ChartLineProps {}

/* ======    global     ====== */
const datas = [
  {
    id: 'japan',
    color: 'hsl(248, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 144,
      },
      {
        x: 'helicopter',
        y: 116,
      },
      {
        x: 'boat',
        y: 289,
      },
      {
        x: 'train',
        y: 113,
      },
      {
        x: 'subway',
        y: 111,
      },
      {
        x: 'bus',
        y: 212,
      },
      {
        x: 'car',
        y: 77,
      },
      {
        x: 'moto',
        y: 293,
      },
      {
        x: 'bicycle',
        y: 192,
      },
      {
        x: 'horse',
        y: 115,
      },
      {
        x: 'skateboard',
        y: 236,
      },
      {
        x: 'others',
        y: 121,
      },
    ],
  },
  {
    id: 'france',
    color: 'hsl(148, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 160,
      },
      {
        x: 'helicopter',
        y: 246,
      },
      {
        x: 'boat',
        y: 79,
      },
      {
        x: 'train',
        y: 122,
      },
      {
        x: 'subway',
        y: 235,
      },
      {
        x: 'bus',
        y: 133,
      },
      {
        x: 'car',
        y: 181,
      },
      {
        x: 'moto',
        y: 196,
      },
      {
        x: 'bicycle',
        y: 73,
      },
      {
        x: 'horse',
        y: 284,
      },
      {
        x: 'skateboard',
        y: 121,
      },
      {
        x: 'others',
        y: 9,
      },
    ],
  },
  {
    id: 'us',
    color: 'hsl(238, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 286,
      },
      {
        x: 'helicopter',
        y: 230,
      },
      {
        x: 'boat',
        y: 208,
      },
      {
        x: 'train',
        y: 41,
      },
      {
        x: 'subway',
        y: 137,
      },
      {
        x: 'bus',
        y: 101,
      },
      {
        x: 'car',
        y: 161,
      },
      {
        x: 'moto',
        y: 173,
      },
      {
        x: 'bicycle',
        y: 158,
      },
      {
        x: 'horse',
        y: 91,
      },
      {
        x: 'skateboard',
        y: 48,
      },
      {
        x: 'others',
        y: 226,
      },
    ],
  },
  {
    id: 'germany',
    color: 'hsl(268, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 176,
      },
      {
        x: 'helicopter',
        y: 121,
      },
      {
        x: 'boat',
        y: 127,
      },
      {
        x: 'train',
        y: 62,
      },
      {
        x: 'subway',
        y: 146,
      },
      {
        x: 'bus',
        y: 212,
      },
      {
        x: 'car',
        y: 176,
      },
      {
        x: 'moto',
        y: 117,
      },
      {
        x: 'bicycle',
        y: 183,
      },
      {
        x: 'horse',
        y: 114,
      },
      {
        x: 'skateboard',
        y: 286,
      },
      {
        x: 'others',
        y: 206,
      },
    ],
  },
  {
    id: 'norway',
    color: 'hsl(243, 70%, 50%)',
    data: [
      {
        x: 'plane',
        y: 0,
      },
      {
        x: 'helicopter',
        y: 220,
      },
      {
        x: 'boat',
        y: 258,
      },
      {
        x: 'train',
        y: 257,
      },
      {
        x: 'subway',
        y: 203,
      },
      {
        x: 'bus',
        y: 255,
      },
      {
        x: 'car',
        y: 112,
      },
      {
        x: 'moto',
        y: 238,
      },
      {
        x: 'bicycle',
        y: 204,
      },
      {
        x: 'horse',
        y: 222,
      },
      {
        x: 'skateboard',
        y: 233,
      },
      {
        x: 'others',
        y: 247,
      },
    ],
  },
];
const logger = createLogger('pages/Chart/Line');
const ChartLine = (_: ChartLineProps) => {
  /* ======   variables   ====== */

  // make sure parent container have a defined height when using
  // responsive component, otherwise height will be 0 and
  // no chart will be rendered.
  // website examples showcase many properties,
  // you'll often use just a few of them.
  const MyResponsiveLine = ({ data }: { data: typeof datas }) => (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'transportation',
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'count',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return <MyResponsiveLine data={datas} />;
};

export default ChartLine;
