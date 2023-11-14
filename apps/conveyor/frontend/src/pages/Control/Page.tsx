import { useTcmInfo } from '!/tcm/application/tcm-info';
import { createLogger } from '@package-frontend/utils';
import Table from '@/Table';
import { useServerInfo } from '!/server/application/server-info';
import T1 from './T1';
import T2 from './T2';
import T3 from './T3';
import T4 from './T4';

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
      <div className="p-4 bg-gray-100 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Server Control</h2>
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <Table
            thead={['sid', 'name', 'status', 'version', 'StartedTime']}
            data={serverData}
            makePagination={false}
            makeColumnSelect={false}
            renderSelectComponent={<T3 />}
            renderSubComponent={<T4 />}
          ></Table>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">TCM Control</h2>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <Table
            thead={['tid', 'status', 'version', 'StartedTime', 'AdjTCMConnection']}
            data={tcmData}
            makePagination={true}
            makeColumnSelect={false}
            renderSelectComponent={<T2 />}
            renderSubComponent={<T1 />}
          ></Table>
        </div>
      </div>
    </>
  );
};

export default Control;
