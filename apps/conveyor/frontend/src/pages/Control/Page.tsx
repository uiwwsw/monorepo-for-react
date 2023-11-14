import { useTcmInfo } from '!/tcm/application/get-tcm-info';
import { createLogger } from '@package-frontend/utils';
import Table from '@/Table';
import { useServerInfo } from '!/server/application/get-server-info';
import TcmSub from './TcmSub';
import TcmSelect from './TcmSelect';
import ServerSelect from './ServerSelect';
import ServerSub from './ServerSub';

/* ======   interface   ====== */
/* ======    global     ====== */

const logger = createLogger('pages/Control');
const Control = () => {
  /* ======   variables   ====== */
  const { data: tcmData } = useTcmInfo();
  const { data: serverData } = useServerInfo();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Server Control</h2>
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <Table
          thead={['sid', 'name', 'status', 'version', 'StartedTime']}
          data={serverData}
          makePagination={false}
          makeColumnSelect={false}
          renderSelectComponent={<ServerSelect />}
          renderSubComponent={<ServerSub />}
        ></Table>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">TCM Control</h2>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <Table
          thead={['tid', 'status', 'version', 'StartedTime', 'AdjTCMConnection']}
          data={tcmData}
          makePagination={true}
          makeColumnSelect={false}
          renderSelectComponent={<TcmSelect />}
          renderSubComponent={<TcmSub />}
        ></Table>
      </div>
    </>
  );
};

export default Control;
