import { useTcmInfo } from '!/tcm/application/tcm-info';
import { mockData } from '!/tcm/domain';
import { createLogger } from '@package-frontend/utils';
import React from 'react';
import { makeData } from '!/test/makeData';
import { Button } from '@library-frontend/ui';
import Table from '@/Table';
import { useServerInfo } from '!/server/application/server-info';

/* ======   interface   ====== */
/* ======    global     ====== */

const logger = createLogger('pages/Control');
const Control = () => {
  /* ======   variables   ====== */
  const { data: tcmdata } = useTcmInfo();
  const { data: serverdata } = useServerInfo();

  return (
    <>
      <div className="p-4 bg-gray-100 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Server Control</h2>
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <Table
            thead={['sid', 'name', 'status', 'version', 'StartedTime']}
            data={serverdata as unknown[]}
            makePagination={false}
            makeColumnSelect={false}
            renderSelectComponent={renderSelectComponentServer}
            renderSubComponent={renderSubComponentServer}
          ></Table>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">TCM Control</h2>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <Table
            thead={['tid', 'status', 'version', 'StartedTime', 'AdjTCMConnection']}
            data={tcmdata as unknown[]}
            makePagination={true}
            makeColumnSelect={false}
            renderSelectComponent={renderSelectComponent}
            renderSubComponent={renderSubComponent}
          ></Table>
        </div>
      </div>
    </>
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

const renderSelectComponentServer = () => {
  return (
    <div className="flex justify-end space-x-2">
      <Button>Start</Button>
      <Button>Stop</Button>
      <Button>Restart</Button>
      <Button>Reload</Button>
    </div>
  );
};

const renderSubComponentServer = () => {
  return (
    <div className="flex justify-end space-x-2">
      <Button>Logs</Button>
    </div>
  );
};

export default Control;
