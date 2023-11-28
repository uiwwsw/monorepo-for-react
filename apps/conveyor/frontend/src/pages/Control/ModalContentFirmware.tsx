import { useTcmBackupDelete } from '!/control/application/delete-tcm-backup';
import { useTcmBackup } from '!/control/application/get-tcm-backup';
import { useUpdateFirmware } from '!/control/application/post-update-firmware';
import { ResponseResult } from '!/control/domain';
import { Button, Combo, ModalWithBtn, ToastWithPortal } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useEffect, useState } from 'react';

/* ======   interface   ====== */
export interface ModalContentFirmwareProps {
  tid?: number;
}

/* ======    global     ====== */
const logger = createLogger('pages/Control/ModalContentFirmware');

const ModalContentFirmware = ({ tid }: ModalContentFirmwareProps) => {
  /* ======   variables   ====== */
  const [backupFiles, setBackupFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState('');
  const { data: backupList, error } = useTcmBackup(tid);
  const { trigger: deleteTrigger } = useTcmBackupDelete();
  const { trigger: updateTrigger } = useUpdateFirmware();
  const [toastMessages, setToastMessages] = useState<string[]>([]);

  /* ======   function    ====== */
  const showToast = (msg: string) => setToastMessages((prev) => [...prev, msg]);
  const handleFileSelect = (selectedFileName: string) => {
    setSelectedFile(selectedFileName);
  };

  const handleFileDelete = () => {
    if (tid === undefined) return;
    deleteTrigger({
      tid,
      fileName: selectedFile,
    });

    setBackupFiles(backupFiles.filter((file) => file !== selectedFile));
    setSelectedFile('');
  };

  const handleFileUpdate = async () => {
    if (tid === undefined) return;
    showToast('선택한 펌웨어 업데이트 중입니다.');

    try {
      const status = await updateTrigger({
        tid,
        fileName: selectedFile,
      });
      if (status?.result === ResponseResult.SUCCESS) {
        showToast(`펌웨어 업데이트 완료`);
      } else {
        showToast(`펌웨어 업데이트 실패, ${status?.reason}`);
      }
    } catch (error) {
      showToast(`${error}`);
    }
  };

  /* ======   useEffect   ====== */
  useEffect(() => {
    if (backupList) {
      setBackupFiles(backupList.map((fileInfo) => fileInfo.fileName));
    }
  }, [backupList]);
  logger(error);
  return (
    <>
      {toastMessages.map((x) => (
        <ToastWithPortal open>{x}</ToastWithPortal>
      ))}
      <h2 className="text-lg font-semibold">TCM {tid} 펌웨어 업데이트</h2>
      <div className="flex flex-col space-y-4 mt-4">
        <div>
          <span className="text-sm font-medium">파일 선택:</span>
          <Combo
            onChange={handleFileSelect}
            placeholder="백업 파일"
            options={backupFiles.map((file) => ({
              value: file,
              label: file,
            }))}
          ></Combo>
        </div>
        {selectedFile && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">선택된 파일: {selectedFile}</span>
            <ModalWithBtn
              hasButton={['OK', 'CANCEL']}
              button={
                <Button themeColor="secondary" themeSize="sm">
                  삭제
                </Button>
              }
              onClose={(value) => {
                if (value === 'OK') {
                  handleFileDelete();
                }
              }}
            >
              파일을 삭제하시겠습니까?
            </ModalWithBtn>
            <Button themeSize={'sm'} onClick={handleFileUpdate}>
              업데이트
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ModalContentFirmware;
