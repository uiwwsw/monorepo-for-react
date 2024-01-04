import { useCheckTcmClient } from '!/redis/application/get-tcm-client';
import Empty from '@/Empty';
import H2 from '@/Typography/H2';
import { Button, ModalWithBtn, ToastWithPortal } from '@library-frontend/ui';

interface ControlModalDetailProps {
  tid?: number;
}

/* ======    global     ====== */

const ControlModalDetail = ({ tid }: ControlModalDetailProps) => {
  /* ======   variables   ====== */
  const { trigger, data, error } = useCheckTcmClient();
  /* ======   function    ====== */
  const handleGetTcmStatus = async () => {
    if (!tid) return;
    trigger({ tcm_id: tid });
  };
  /* ======   useEffect   ====== */
  return (
    <>
      <ToastWithPortal open={error?.message}>{error?.message}</ToastWithPortal>
      <ModalWithBtn
        button={
          <Button onClick={handleGetTcmStatus} themeSize="sm" themeColor={'tertiary'}>
            Alive
          </Button>
        }
        hasButton={['CANCEL']}
        hasCloseBtn
      >
        <H2>TCM {tid} 연결상태</H2>
        <div className={data?.state.length ? 'grid grid-cols-2 gap-4 pt-4' : 'grid'}>
          {data?.state.length ? (
            data.state.map((status, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                <span className="text-md font-medium">TCM {status.tcmId} :</span>
                <span className="font-semibold text-md ml-4 text-green-500">{status.alive}</span>
              </div>
            ))
          ) : (
            <Empty className="py-5 m-auto" />
          )}
        </div>
      </ModalWithBtn>
    </>
  );
};

export default ControlModalDetail;
