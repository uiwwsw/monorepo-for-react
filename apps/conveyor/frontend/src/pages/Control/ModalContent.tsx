import { Button } from '@library-frontend/ui';
import { useRef, useState } from 'react';
import { useUpdateFirmware } from 'src/libs/control/application/useUpdateFirmware';
import ProgressBar from './ProgressBar';
import { UpdateStatus } from 'src/libs/control/domain';
import { createLogger } from '@package-frontend/utils';
import Upload from './Upload';
import { useUploadFirmware } from 'src/libs/control/application/useUploadFirmware';

/* ======   interface   ====== */

interface ModalContentProps {
  selectedRows?: number[];
}

interface ProgressState {
  [key: number]: { progress: number; status: UpdateStatus };
}
/* ======    global     ====== */
const logger = createLogger('pages/ModalContent');

const ModalContent = ({ selectedRows }: ModalContentProps) => {
  /* ======   variables   ====== */
  const { trigger: updateTrigger } = useUpdateFirmware();
  const [progressStates, setProgressStates] = useState<ProgressState>({});
  const [updateInProgress, setUpdateInProgress] = useState(false);
  const continueUpdatingRef = useRef(true);
  const { trigger: uploadTrigger } = useUploadFirmware();

  /* ======   function    ====== */
  const initializeProgressStates = () => {
    const initialStates: ProgressState = {};
    selectedRows?.forEach((row) => {
      initialStates[row] = { progress: 0, status: UpdateStatus.Idle };
    });
    setProgressStates(initialStates);
  };

  const handleUpdateStop = () => {
    continueUpdatingRef.current = false;
  };

  const onUpload = async (file: File) => {
    await uploadTrigger({ file });

    if (!selectedRows || updateInProgress) return;
    setUpdateInProgress(true);
    initializeProgressStates();
    continueUpdatingRef.current = true;

    for (let index = 0; index < selectedRows.length; index++) {
      if (!continueUpdatingRef.current) break;

      const tid = selectedRows[index];
      setProgressStates((prev) => ({
        ...prev,
        [tid]: { progress: prev[tid].progress, status: UpdateStatus.Updating },
      }));

      try {
        const response = await updateTrigger({ tid });

        if (response === UpdateStatus.Completed) {
          setProgressStates((prev) => ({ ...prev, [tid]: { progress: 100, status: UpdateStatus.Completed } }));
        }
      } catch (error) {
        console.error('Error updating row:', tid, error);
        setProgressStates((prev) => ({ ...prev, [tid]: { progress: prev[tid].progress, status: UpdateStatus.Idle } }));
      }
    }

    setUpdateInProgress(false);
  };

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="p-5 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">TCM Update</h2> {/* 제목을 별도의 줄로 분리 */}
      <div className="flex justify-between items-center mb-6">
        <Upload onSubmit={onUpload} />
        <Button onClick={handleUpdateStop} disabled={!updateInProgress}>
          Stop
        </Button>
      </div>
      {selectedRows?.map((row, index) => (
        <div key={index} className="mb-4 flex items-center">
          <span className="text-sm font-medium text-gray-700 w-12">{row}:</span>
          <ProgressBar value={progressStates[row]?.progress} status={progressStates[row]?.status} />
        </div>
      ))}
    </div>
  );
};

export default ModalContent;
