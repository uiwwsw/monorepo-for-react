import { useCheckTcmClient } from '!/redis/application/get-tcm-client';
import Test from '@/Test';
import H2 from '@/Typography/H2';
import { Button, ModalWithBtn } from '@library-frontend/ui';

interface ModalDetailProps {
  tid?: number;
}

/* ======    global     ====== */

const ModalDetail = ({ tid }: ModalDetailProps) => {
  /* ======   variables   ====== */
  const { trigger, data } = useCheckTcmClient();
  /* ======   function    ====== */
  const handleGetTcmStatus = async () => {
    if (!tid) return;
    trigger({ tcm_id: tid });
  };
  /* ======   useEffect   ====== */
  return (
    <>
      <ModalWithBtn
        button={
          <Test>
            <Button onClick={handleGetTcmStatus} themeSize="sm" themeColor={'tertiary'}>
              Alive
            </Button>
          </Test>
        }
        hasButton={['CANCEL']}
        hasCloseBtn
      >
        <H2>TCM {tid} 연결상태</H2>
        <div className="flex flex-wrap">
          {data?.state.map((status, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg m-2">
              <span className="text-md font-medium">TCM {status.tcmId} :</span>
              <span className="font-semibold text-md ml-4 text-green-500">{status.alive}</span>
            </div>
          ))}
        </div>
      </ModalWithBtn>
    </>
  );
};

export default ModalDetail;