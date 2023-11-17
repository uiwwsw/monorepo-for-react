import { Button } from '@library-frontend/ui';
import { useRef, useState } from 'react';
import { useUpdateFirmware } from 'src/libs/control/application/useUpdateFirmware';
import ProgressBar from './ProgressBar';
import { UpdateStatus } from 'src/libs/control/domain';
import { createLogger } from '@package-frontend/utils';

/* ======   interface   ====== */

interface ModalContentProps {
  selectedFile?: string;
  selectedRows?: number[];
}

interface ProgressState {
  [key: number]: { progress: number; status: UpdateStatus };
}
/* ======    global     ====== */
const logger = createLogger('pages/ModalContent');

const ModalContent = ({ selectedFile, selectedRows }: ModalContentProps) => {
  /* ======   variables   ====== */
  const { trigger: updateTrigger } = useUpdateFirmware();
  const [progressStates, setProgressStates] = useState<ProgressState>({});
  const [updateInProgress, setUpdateInProgress] = useState(false);
  const continueUpdatingRef = useRef(true);

  /* ======   function    ====== */
  const initializeProgressStates = () => {
    const initialStates: ProgressState = {};
    selectedRows?.forEach((row) => {
      initialStates[row] = { progress: 0, status: UpdateStatus.Idle };
    });
    setProgressStates(initialStates);
  };

  const handleUpdateStart = async () => {
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

  const handleUpdateStop = () => {
    continueUpdatingRef.current = false;
  };

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="p-5 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
      <div className="flex justify-between mb-4 space-x-4">
        <Button onClick={handleUpdateStart} disabled={updateInProgress}>
          Update Start
        </Button>
        <Button onClick={handleUpdateStop} disabled={!updateInProgress}>
          Update Stop
        </Button>
      </div>
      <div className="mb-6 font-bold text-lg">{selectedFile}</div>
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
