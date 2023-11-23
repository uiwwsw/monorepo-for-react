import { useTcmInfo } from 'src/libs/control/application/get-tcm-info';
import { createLogger } from '@package-frontend/utils';
import Table from '@/Table';
import { useServerInfo } from 'src/libs/control/application/get-server-info';
import TcmSub from './TcmSub';
import TcmSelect from './TcmSelect';
import ServerSelect from './ServerSelect';
import ServerSub from './ServerSub';
import { useCallback, useState } from 'react';
import { Button } from '@library-frontend/ui';
import { ConnectionStatus, TCMInfo } from 'src/libs/control/domain';

/* ======   interface   ====== */
/* ======    global     ====== */

const logger = createLogger('pages/Control');
const Control = () => {
  /* ======   variables   ====== */
  const { data: tcmData } = useTcmInfo();
  const { data: serverData } = useServerInfo();
  const [selectedRowsMapping, setSelectedRowsMapping] = useState<number[]>([]);

  /* ======   function    ====== */

  const handleRowSelection = useCallback(
    (selectedRows: { [key: string]: boolean }) => {
      if (!tcmData) {
        console.warn('tcmData is undefined');
        return;
      }

      const selectedTids = Object.keys(selectedRows)
        .filter((key) => selectedRows[key])
        .map((key) => tcmData[parseInt(key)]?.tid)
        .filter((tid) => tid !== undefined);

      setSelectedRowsMapping(selectedTids);
    },
    [tcmData],
  );

  const convertAdjTCMConnection = (data: TCMInfo[] | undefined): TCMInfo[] | undefined => {
    if (data === undefined) return undefined;
    return data.map((item) => {
      const totalConnections = item.AdjTCMConnection.length;
      const onConnections =
        item.AdjTCMConnection instanceof Array
          ? item.AdjTCMConnection.filter((conn) => conn.cstatus === ConnectionStatus.ON).length
          : '';

      return {
        ...item,
        AdjTCMConnection: `${onConnections} / ${totalConnections}`,
      };
    });
  };

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">TCM Control</h2>
          <div className="space-x-2">
            <Button themeColor="secondary">Resume</Button>
            <Button themeColor="secondary">Pause</Button>
          </div>
        </div>

        <Table
          thead={['tid', 'status', 'version', 'AdjTCMConnection', 'Process']}
          data={convertAdjTCMConnection(tcmData)}
          makePagination={false}
          makeColumnSelect={false}
          renderSelectComponent={<TcmSelect selectedRows={selectedRowsMapping} />}
          rowSelectionChange={handleRowSelection}
          renderSubComponent={TcmSub}
        ></Table>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Server Control</h2>
        <Table
          thead={['sid', 'name', 'status', 'version']}
          data={serverData}
          makePagination={false}
          makeColumnSelect={false}
          renderSelectComponent={<ServerSelect />}
          renderSubComponent={ServerSub}
        ></Table>
      </div>
    </>
  );
};

export default Control;
