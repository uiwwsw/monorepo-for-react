import { Button } from '@library-frontend/ui';
import { useRef, useState } from 'react';
import { useUpdateFirmware } from '!/control/application/post-update-firmware';
import ProgressBar from './ProgressBar';
import { ReponseStatus, UploadStatus } from 'src/libs/control/domain';
import { createLogger } from '@package-frontend/utils';
import Upload from './Upload';
import { useUploadFirmware } from '!/control/application/post-upload-firmware';

/* ======   interface   ====== */

interface ModalContentUpdateProps {
  selectedRows?: number[];
}

interface ProgressState {
  [key: number]: { progress: number; status: UploadStatus };
}
/* ======    global     ====== */
const logger = createLogger('pages/ModalContentUpdate');

const ModalContentUpdate = ({ selectedRows }: ModalContentUpdateProps) => {
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
      initialStates[row] = { progress: 0, status: UploadStatus.Idle };
    });
    setProgressStates(initialStates);
  };

  const handleUpdateStop = () => {
    continueUpdatingRef.current = false;
  };

  const onUpload = async (file: File) => {
    const uploadFile = await uploadTrigger({ file });
    if (uploadFile === undefined) return;

    if (!selectedRows || updateInProgress) return;
    setUpdateInProgress(true);
    initializeProgressStates();
    continueUpdatingRef.current = true;

    for (let index = 0; index < selectedRows.length; index++) {
      if (!continueUpdatingRef.current) break;

      const tid = selectedRows[index];
      setProgressStates((prev) => ({
        ...prev,
        [tid]: { progress: prev[tid].progress, status: UploadStatus.Updating },
      }));

      try {
        const status = await updateTrigger({ tid, fileName: uploadFile?.name });

        if (status?.result === ReponseStatus.SUCCESS) {
          setProgressStates((prev) => ({ ...prev, [tid]: { progress: 100, status: UploadStatus.Completed } }));
        }
      } catch (error) {
        console.error('Error updating row:', tid, error);
        setProgressStates((prev) => ({ ...prev, [tid]: { progress: prev[tid].progress, status: UploadStatus.Idle } }));
      }
    }

    setUpdateInProgress(false);
  };

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="p-5 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">TCM 업데이트</h2>
      <div className="flex justify-between items-center mb-6">
        <Upload onSubmit={onUpload} />
        <Button themeSize={'sm'} onClick={handleUpdateStop} disabled={!updateInProgress}>
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

export default ModalContentUpdate;
