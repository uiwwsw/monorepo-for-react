import { useTcmLogList } from '!/control/application/get-tcm-log-list';
import { formatFileSize } from '!/control/domain';
import H2 from '@/Typography/H2';
import { Button, ModalWithBtn, ToastWithPortal } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';

/* ======   interface   ====== */
export interface ModalLogsTcmProps {
  tid?: number;
}

/* ======    global     ====== */
const logger = createLogger('pages/Control/Modals/LogsTcm');

const ModalLogsTcm = ({ tid }: ModalLogsTcmProps) => {
  /* ======   variables   ====== */

  const { data, trigger, isMutating, error } = useTcmLogList();

  /* ======   function    ====== */
  const handleClick = () => trigger({ tid });
  /* ======   useEffect   ====== */

  logger('render');
  return (
    <>
      <ToastWithPortal open={error?.message}>{error?.message}</ToastWithPortal>
      <ModalWithBtn
        button={
          <Button themeSize="sm" themeColor={'tertiary'} onClick={handleClick}>
            Logs
          </Button>
        }
        hasButton={['CANCEL']}
        defaultLoading={isMutating}
        hasCloseBtn
      >
        <H2>TCM {tid} 로그</H2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.map((log, index) => (
            <div
              key={index}
              className="bg-yellow-200 text-black p-3 rounded-lg flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:items-center"
            >
              <div className="truncate">
                <div className="font-medium">{log.fileName}</div>
                <div className="text-sm text-black">{formatFileSize(log.fileSize)}</div>
              </div>
              <div className="flex space-x-2">
                <Button themeSize="sm" themeColor="secondary">
                  보기
                </Button>
                <Button themeSize="sm" themeColor="secondary">
                  다운로드
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ModalWithBtn>
    </>
  );
};

export default ModalLogsTcm;
