import { useTcmInfo } from '!/tcm/application/tcm-info';
import { mockData } from '!/tcm/domain';
import { createLogger } from '@package-frontend/utils';
import React from 'react';
import { Person, makeData } from '!/test/makeData';
import ReusableTable from '@/Table';
import { Row } from '@tanstack/react-table';
import { Button } from '@library-frontend/ui';

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
        renderSubComponent={renderSubComponent}
      ></ReusableTable>
    </div>
  );
};

const renderSubComponent = () => {
  const buttonStyle = {
    padding: '10px 20px',
    margin: '5px',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'start',
  };

  return (
    <div style={containerStyle}>
      <Button style={buttonStyle}>Logs</Button>
      <Button style={buttonStyle}>Firmware</Button>
    </div>
  );
};

export default Control;
