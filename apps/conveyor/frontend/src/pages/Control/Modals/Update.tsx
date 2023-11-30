import { Button, ModalWithBtn } from '@library-frontend/ui';
import { useRef, useState } from 'react';
import { useUpdateFirmware } from '!/control/application/post-update-firmware';
import ProgressBar from '../ProgressBar';
import { UPLOAD_STATUS } from '!/control/domain';
import { createLogger } from '@package-frontend/utils';
import Upload from '../Upload';
import { useUploadFirmware } from '!/control/application/post-upload-firmware';

/* ======   interface   ====== */
export interface ModalUpdateProps {
  selectedRows?: number[];
  disabled?: boolean;
}

interface ProgressState {
  [key: number]: { progress: number; status: UPLOAD_STATUS };
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/Modals/Update');

const ModalUpdate = ({ selectedRows, disabled }: ModalUpdateProps) => {
  /* ======   variables   ====== */
  const { trigger: updateTrigger } = useUpdateFirmware();
  const [progressStates, setProgressStates] = useState<ProgressState>({});
  const continueUpdatingRef = useRef(true);
  const { trigger: uploadTrigger } = useUploadFirmware();

  /* ======   function    ====== */
  const initializeProgressStates = () => {
    const initialStates: ProgressState = {};
    selectedRows?.forEach((row) => {
      initialStates[row] = { progress: 0, status: UPLOAD_STATUS.IDLE };
    });
    setProgressStates(initialStates);
  };

  const handleUpdateStop = () => (continueUpdatingRef.current = false);

  const handleUpload = async (file: File) => {
    continueUpdatingRef.current = true;
    const uploadFile = await uploadTrigger({ file });
    if (uploadFile === undefined) return;

    if (!selectedRows) return;
    initializeProgressStates();

    for (let index = 0; index < selectedRows.length; index++) {
      if (!continueUpdatingRef.current) throw new Error('강제 종료');

      const tid = selectedRows[index];
      setProgressStates((prev) => ({
        ...prev,
        [tid]: { progress: prev[tid].progress, status: UPLOAD_STATUS.UPDATING },
      }));

      try {
        const status = await updateTrigger({ tid, fileName: uploadFile?.name });

        if (status?.result === 'SUCCESS') {
          setProgressStates((prev) => ({ ...prev, [tid]: { progress: 100, status: UPLOAD_STATUS.COMPLETED } }));
        }
      } catch (error) {
        console.error('ERROR updating row:', tid, error);
        setProgressStates((prev) => ({ ...prev, [tid]: { progress: prev[tid].progress, status: UPLOAD_STATUS.IDLE } }));
      }
    }
  };

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      <ModalWithBtn
        hasCloseBtn
        button={
          <Button disabled={disabled} themeColor="tertiary">
            Update
          </Button>
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
              <ProgressBar value={progressStates[row]?.progress} status={progressStates[row]?.status} />
            </div>
          ))}
        </div>
      </ModalWithBtn>
    </>
  );
};

export default ModalUpdate;
