import { Button, ModalWithBtn } from '@library-frontend/ui';
import { useRef, useState } from 'react';
import { createLogger } from '@package-frontend/utils';
import Upload from '../Upload';
import { useUploadFirm } from '!/control/application/put-upload-firmware';
import { useUpdateFirm } from '!/control/application/post-update-firmware';
import { useTcmNetwork } from '!/redis/application/get-tcm-network';
import Test from '@/Test';

/* ======   interface   ====== */
export interface ModalUpdateProps {
  selectedRows?: number[];
  selectedAdds?: string[];
  disabled?: boolean;
}
export const enum UPLOAD_STATUS {
  IDLE,
  UPDATING,
  FINISHED,
  FAILED,
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/Modals/Update');
const statusClasses: Record<UPLOAD_STATUS, string> = {
  [UPLOAD_STATUS.IDLE]: 'bg-gray-400',
  [UPLOAD_STATUS.UPDATING]: 'bg-gray-500',
  [UPLOAD_STATUS.FINISHED]: 'bg-green-500',
  [UPLOAD_STATUS.FAILED]: 'bg-red-500',
};
const ModalUpdate = ({ selectedRows, disabled, selectedAdds }: ModalUpdateProps) => {
  /* ======   variables   ====== */
  const { trigger: updateTrigger } = useUpdateFirm();
  const { trigger: uploadTrigger } = useUploadFirm();
  const { trigger: networkTrigger, data: port } = useTcmNetwork();

  const [status, setStatus] = useState<UPLOAD_STATUS[]>([]);
  const continueUpdatingRef = useRef(true);

  /* ======   function    ====== */

  const handleUpdateStop = () => {
    continueUpdatingRef.current = false;
    logger('handleUpdateStop');
  };

  const handleUpload = async (file: File) => {
    logger('handleUpload');

    continueUpdatingRef.current = true;

    const fileName = await uploadTrigger({ file });
    logger(fileName);
    if (fileName === undefined) return;

    if (!selectedRows || !selectedAdds || !port) return;
    setStatus(Array(selectedRows.length).fill(UPLOAD_STATUS.IDLE));

    for (let index = 0; index < selectedRows.length; index++) {
      if (!continueUpdatingRef.current) throw new Error('강제 종료');
      logger('handleUpload', index);
      const tid = selectedRows[index];
      const port = await networkTrigger({ tcm_id: tid });
      const address = selectedAdds[index];
      setStatus((prev) => {
        prev[index] = UPLOAD_STATUS.UPDATING;
        return prev;
      });

      try {
        const status = await updateTrigger({ fileName, address, port });

        if (status)
          setStatus((prev) => {
            prev[index] = UPLOAD_STATUS.FINISHED;
            return prev;
          });
        throw new Error('문제발생');
      } catch (error) {
        console.error('ERROR updating row:', tid, error);
        setStatus((prev) => {
          prev[index] = UPLOAD_STATUS.FAILED;
          return prev;
        });
      }
    }
  };

  /* ======   useEffect   ====== */
  return (
    <>
      <ModalWithBtn
        hasCloseBtn
        button={
          <Test>
            <Button disabled={disabled} themeColor="tertiary">
              Update
            </Button>
          </Test>
        }
        hasButton={['CANCEL']}
      >
        <div className="p-5 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">TCM 펌웨어 업데이트</h2>
          <div className="flex justify-between items-center gap-2 mb-6">
            <Upload onSubmit={handleUpload} onCancel={handleUpdateStop} />
          </div>
          {selectedRows?.map((row, index) => (
            <div key={index} className="mb-4 flex items-center">
              <span className="text-sm font-medium text-gray-700 w-12">{row}:</span>
              <div className="w-full bg-gray-200 rounded h-6">
                <div
                  className={`flex items-center relative rounded h-full ${
                    statusClasses[status[index]] ?? 'bg-gray-400'
                  }`}
                >
                  <div className="flex w-full">
                    <span className={`text-white text-sm font-medium p-2 w-full`}>{status[index]}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ModalWithBtn>
    </>
  );
};

export default ModalUpdate;
