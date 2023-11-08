import ChartLine from '@/Chart/Line';
import { useHeaderContext } from '@/HeaderContext';
import { Tab, Select, Input, Button, Chip } from '@library-frontend/ui';
import { Calendar } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useState, ChangeEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* ======   interface   ====== */
/* ======    global     ====== */
const tabs = ['ALL', 'INPUT_OUTPUT', 'ALARM', 'CARRIER', 'WARNING'];
const logger = createLogger('pages/Stats');
const graphChartClassName = 'bg-slate-300 rounded-md p-1 m-1 my-2';
const sortBtnClassName = 'border-2 px-2 mx-1 align-middle rounded-lg text-gray-200 cursor-pointer py-2 text-sm h-fit';
const Stats = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  const { setChildren } = useHeaderContext();

  const [duration, setDuration] = useState<Dayjs[]>([]);
  const [showDownloadBtn, setShowDownloadBtn] = useState<boolean>(false);
  const options = [
    {
      label: 'All',
      value: '1',
    },
    {
      label: 'Input1',
      value: '2',
    },
  ];
  /* ======   function    ====== */
  const handleChange = (duration: Dayjs | Dayjs[]) => {
    duration instanceof Array && setDuration(duration);
  };

  const onChangeGraphPort = (e: ChangeEvent<HTMLSelectElement>) => {
    /* find data with selected port */
  };

  const onChangeSearchKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    /** find data with keyword */
  };

  const onChangeTabIndex = (index: number) => {
    console.log(index);
    if (index < 2) setShowDownloadBtn(false);
    else setShowDownloadBtn(true);
  };
  /* ======   useEffect   ====== */
  useEffect(() => {
    setChildren(
      <div className="flex items-center gap-2">
        <Calendar
          placeholder={t('날짜를 선택해 주세요.')}
          selectRangeHolder={t('기간을 선택해 주세요.')}
          tooltipMsg={t('시작날짜의 시간 00시 00분 00초, 끝날짜의 시간 23시 59분 59초는 생략됩니다.')}
          selectRange
          onChange={handleChange}
          themeColor="secondary"
        />
      </div>,
    );
    return () => setChildren(undefined);
  }, []);
  logger('render');
  return (
    <>
      <div className="h-60 flex rounded-xl border mb-3">
        <div className="h-full w-4/5">
          <ChartLine />
        </div>
        <div className="h-full w-1/5 p-1 pl-3 border-l-2">
          <Select options={options} onChange={onChangeGraphPort} />
          <div className={graphChartClassName}>Transport Total : {}</div>
          <div className={graphChartClassName}>Transport Average : {}</div>
          <div className={graphChartClassName}>Alarm Total : {}</div>
          <div className={graphChartClassName}>Alarm Average : {}</div>
        </div>
      </div>
      <div className="flex my-5 place-content-end gap-5">
        {!showDownloadBtn && <Chip labels={['ZONE', 'ALARM', 'CARRIER']} multiChoice={false} themeSize={'md'} />}
        {showDownloadBtn && (
          <div>
            <Button themeColor={'secondary'} themeSize={'md'}>
              Download
            </Button>
          </div>
        )}
        <Input type="search" placeholder="search" role="textbox" onChange={onChangeSearchKeyword} />
      </div>
      <Tab header={tabs} onChange={onChangeTabIndex}>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
      </Tab>
    </>
  );
};

export default Stats;
