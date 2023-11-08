import { useTcmInfo } from '!/tcm/application/tcm-info';
import { mockData } from '!/tcm/domain';
import { createLogger } from '@package-frontend/utils';
import React from 'react';
import { makeData } from '!/test/makeData';
import ReusableTable from '@/Table';

/* ======   interface   ====== */
/* ======    global     ====== */

const logger = createLogger('pages/Control');
const Control = () => {
  /* ======   variables   ====== */
  const { data: tcmdata } = useTcmInfo();
  logger('Data', tcmdata);

  const [data, setData] = React.useState(() => makeData(25));

  return (
    <div className="p-2">
      <ReusableTable
        thead={['firstName', 'lastName', 'age', 'visits', 'status', 'progress']}
        data={data}
        useSelect={true}
        usePagination={true}
        useColumnSelect={true}
      ></ReusableTable>
    </div>
  );
};

export default Control;
