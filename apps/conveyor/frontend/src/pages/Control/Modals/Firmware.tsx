import { useTcmBackupDelete } from '!/control/application/delete-tcm-backup';
import { useTcmBackup } from '!/control/application/get-tcm-backup';
import { useUpdateFirmware } from '!/control/application/post-update-firmware';
import useToastsForControl from '#/useToastsForControl';
import H2 from '@/Typography/H2';
import { Button, Combo, ModalWithBtn, ToastWithPortal } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useEffect, useState } from 'react';

/* ======   interface   ====== */
export interface ModalFirmwareProps {
  tid?: number;
}

/* ======    global     ====== */
const logger = createLogger('pages/Control/Modals/Firmware');

const ModalFirmware = ({ tid }: ModalFirmwareProps) => {
  /* ======   variables   ====== */
  const [backupFiles, setBackupFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState('');
  const { data, error, trigger, isMutating } = useTcmBackup();
  const { trigger: deleteTrigger } = useTcmBackupDelete();
  const { trigger: updateTrigger } = useUpdateFirmware();
  const { Toasts, adapterEvent } = useToastsForControl({ selectedRows: [selectedFile] });

  /* ======   function    ====== */
  const handleClick = () => trigger({ tid });

  const handleFileSelect = (selectedFileName: string) => setSelectedFile(selectedFileName);

  const handleFileDelete = () => {
    if (tid === undefined) return;
    deleteTrigger({
      tid,
      fileName: selectedFile,
    });

    setBackupFiles(backupFiles.filter((file) => file !== selectedFile));
    setSelectedFile('');
  };

  const handleFileUpdate = () =>
    adapterEvent({
      startMsg: '선택한 펌웨어 업데이트 중입니다.',
      successMsg: '펌웨어 업데이트 완료',
      failMsg(fails) {
        logger(fails);
        return fails.map((v) => `${v.id}파일 ${v.message} 에러 발생`).join(',');
      },
      event(id) {
        if (tid === undefined) return;
        return updateTrigger({
          tid,
          fileName: id,
        });
      },
    });

  /* ======   useEffect   ====== */
  useEffect(() => {
    if (data) setBackupFiles(data.map((fileInfo) => fileInfo.fileName));
  }, [data]);
  logger(error);
  return (
    <>
      {Toasts}
      <ToastWithPortal open={error?.message}>{error?.message}</ToastWithPortal>
      <ModalWithBtn
        button={
          <Button themeSize="sm" themeColor={'tertiary'} onClick={handleClick}>
            Firmware
          </Button>
        }
        hasButton={['CANCEL']}
        defaultLoading={isMutating}
        hasCloseBtn
      >
        <H2>TCM {tid} 펌웨어 업데이트</H2>
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
                onClose={(value) => value === 'OK' && handleFileDelete()}
              >
                파일을 삭제하시겠습니까?
              </ModalWithBtn>
              <Button themeSize={'sm'} onClick={handleFileUpdate}>
                업데이트
              </Button>
            </div>
          )}
        </div>
      </ModalWithBtn>
    </>
  );
};

export default ModalFirmware;
