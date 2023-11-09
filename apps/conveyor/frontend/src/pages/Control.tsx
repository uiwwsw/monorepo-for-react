import { useTcmInfo } from '!/tcm/application/tcm-info';
import { mockData } from '!/tcm/domain';
import { createLogger } from '@package-frontend/utils';
import React from 'react';
import { makeData } from '!/test/makeData';
import ReusableTable from '@/Table/ReusableTable';
import { Button } from '@library-frontend/ui';

/* ======   interface   ====== */
/* ======    global     ====== */

const logger = createLogger('pages/Control');
const Control = () => {
  /* ======   variables   ====== */
  //const { data: tcmdata } = useTcmInfo();
  //logger('Data', tcmdata);

  const [data] = React.useState(() => makeData(55));

  return (
    <div className="p-2">
      <ReusableTable
        thead={['firstName', 'lastName', 'age', 'visits', 'status', 'progress']}
        data={data}
        makePagination={true}
        makeColumnSelect={true}
        renderSelectComponent={renderSelectComponent}
        renderSubComponent={renderSubComponent}
      ></ReusableTable>
    </div>
  );
};

const renderSelectComponent = () => {
  return (
    <div className="flex justify-end space-x-2">
      <Button>Start</Button>
      <Button>Stop</Button>
      <Button>Restart</Button>
      <Button>Reload</Button>
      <Button>Update</Button>
    </div>
  );
};

const renderSubComponent = () => {
  return (
    <div className="flex justify-end space-x-2">
      <Button>Logs</Button>
      <Button>Firmware</Button>
    </div>
  );
};

export default Control;
