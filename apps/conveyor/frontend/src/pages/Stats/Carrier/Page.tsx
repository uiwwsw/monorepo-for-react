import { useHeaderContext } from '@/HeaderContext';
import { Calendar } from '@library-frontend/ui';
import { createLogger, newDate } from '@package-frontend/utils';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchArg } from '!/stats/domain';
import { useGetCarrierInfo } from '!/stats/application/get-carrierInfo';
import { StatsCarrierData } from '!/stats/domain';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Stats');
const StatsCarrier = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  const { setChildren } = useHeaderContext();

  const [duration, setDuration] = useState<Dayjs[]>([newDate(), newDate([7, 'day'])]);
  const [renderCarrierList, setRenderCarrierList] = useState<StatsCarrierData[]>([]);

  const { trigger, error, isMutating } = useGetCarrierInfo();

  /* ======   function    ====== */
  const handleCalenderChange = (duration: Dayjs | Dayjs[]) => {
    duration instanceof Array && setDuration(duration);
  };

  const onChangeSearchKeyword = async (character: string) => {
    if (character === '') return;

    const regex1 = new RegExp(character);
    const find = [...renderCarrierList.values()].filter((carrier) => {
      let str = JSON.stringify(carrier);
      if (regex1.exec(str) !== null) return true;
      else return false;
    });

    const arg: SearchArg = {
      startTime: duration[0].toString(),
      endTime: duration[1].toString(),
      character: character,
    };

    const searchedCarrierList = await trigger(arg);

    if (searchedCarrierList && searchedCarrierList.length > 0) {
      setRenderCarrierList(searchedCarrierList.concat(find));
      return;
    }

    if (find.length > 0) {
      setRenderCarrierList(find);
    }
  };

  const handleSearch = async (arg: SearchArg) => {
    const newRenderZone = await trigger(arg);
    logger(newRenderZone);
    //setRenderZone(newRenderZone)
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    handleSearch({ startTime: newDate().toString(), endTime: newDate([1, 'day']).toString() });
    setChildren(
      <div className="flex items-center gap-2">
        <Calendar
          placeholder={t('날짜를 선택해 주세요.')}
          selectRangeHolder={t('기간을 선택해 주세요.')}
          tooltipMsg={t('시작날짜의 시간 00시 00분 00초, 끝날짜의 시간 23시 59분 59초는 생략됩니다.')}
          selectRange
          onChange={handleCalenderChange}
        />
      </div>,
    );
    return () => setChildren(undefined);
  }, []);
  logger('render', onChangeSearchKeyword, error, isMutating);
  return <></>;
};

export default StatsCarrier;
