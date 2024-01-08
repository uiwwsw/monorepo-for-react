import { Button, Combo, ModalWithBtn, useToasts } from '@library-frontend/ui';
import { useMemo, useRef, useState } from 'react';
import { createLogger } from '@package-frontend/utils';
import ControlFileUpload from '../FileUpload';
import { useUploadFirm } from '!/control/application/put-upload-firmware';
import { useUpdateFirm } from '!/control/application/post-update-firmware';
import { useTcmNetwork } from '!/redis/application/get-tcm-network';
import { useFirmList } from '!/control/application/get-backup-firmware';
import { useDeleteFirm } from '!/control/application/delete-upload-firmware';
import { useTranslation } from 'react-i18next';
import H2 from '@/Typography/H2';
import { useTcmReboot } from '!/control/application/post-tcm-reboot';

/* ======   interface   ====== */
export interface ControlModalUpdateProps {
  selectedRows?: number[];
  selectedAdds?: string[];
  disabled?: boolean;
}
export enum UPLOAD_STATUS {
  IDLE,
  UPDATING,
  FINISHED,
  FAILED,
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/Modals/Update');
const ControlModalUpdate = ({ selectedRows, disabled, selectedAdds }: ControlModalUpdateProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const newFile = t('새 파일 업로드');
  const cancelBtn = t('닫기');
  const okBtn = t('확인');
  const { Toasts, showToast } = useToasts();
  const [selectedFile, setSelectedFile] = useState('');
  const { trigger: deleteTrigger } = useDeleteFirm();
  const [fileList, setFileList] = useState<string[]>([]);
  const { trigger: updateTrigger } = useUpdateFirm();
  const { trigger: firmListTrigger, isMutating } = useFirmList();
  const { trigger: uploadTrigger, process } = useUploadFirm();
  const { trigger: networkTrigger } = useTcmNetwork();
  const { trigger: rebootTrigger } = useTcmReboot();

  const [status, setStatus] = useState<UPLOAD_STATUS[]>([]);
  const continueUpdatingRef = useRef(true);
  const hasBackup = useMemo(() => !(selectedFile !== newFile && !!selectedFile), [selectedFile]);
  /* ======   function    ====== */
  const handleReboot = async () => {
    if (!selectedRows || !selectedAdds) return;
    selectedRows.forEach(async (tcmId, index) => {
      const address = selectedAdds[index];
      const port = await networkTrigger({ tcm_id: tcmId });
      await rebootTrigger({
        address,
        port,
      });
    });
  };
  const handleFileDelete = async () => {
    if (!selectedRows || !selectedAdds) return;
    selectedRows.forEach(async (tcmId, index) => {
      const address = selectedAdds[index];
      const port = await networkTrigger({ tcm_id: tcmId });
      await deleteTrigger({
        fileName: selectedFile,
        address,
        port,
      });
    });
    await Promise.all([setSelectedFile(''), handleFirmList()]);
    showToast({ message: t('삭제 완료') });
  };
  const handleApply = async () => {
    if (!selectedRows || !selectedAdds) return;
    selectedRows.forEach(async (tcmId, index) => {
      const address = selectedAdds[index];
      const port = await networkTrigger({ tcm_id: tcmId });
      await updateTrigger({ fileName: selectedFile, address, port });
    });
    await Promise.all([setSelectedFile(''), handleFirmList()]);
    showToast({ message: t('적용 완료') });
  };
  const handleFirmList = () => {
    if (!selectedRows || !selectedAdds) return;
    setFileList([]);
    selectedRows.forEach(async (tcmId, index) => {
      const address = selectedAdds[index];
      const port = await networkTrigger({ tcm_id: tcmId });
      const data = await firmListTrigger({ port, address });
      if (!data) return;
      await setFileList((prev) => (prev.length ? prev.filter((x) => data.includes(x)) : data));
    });
  };
  const handleFileSelect = (selectedFileName: string) => setSelectedFile(selectedFileName);

  const handleUpdateStop = () => {
    continueUpdatingRef.current = false;
    logger('handleUpdateStop');
  };

  const handleUpload = async (file: File) => {
    logger('handleUpload');

    continueUpdatingRef.current = true;
    logger('handleUpload');

    // logger(process);
    // if (fileName === undefined) return;

    if (!selectedRows || !selectedAdds) return;
    setStatus(Array(selectedRows.length).fill(UPLOAD_STATUS.IDLE));
    for (let index = 0; index < selectedRows.length; index++) {
      if (!continueUpdatingRef.current) throw new Error('강제 종료');
      logger('handleUpload', index);
      const tid = selectedRows[index];
      try {
        setStatus((prev) => {
          prev[index] = UPLOAD_STATUS.UPDATING;
          return prev;
        });
        const port = await networkTrigger({ tcm_id: tid });
        const address = selectedAdds[index];
        await uploadTrigger({ file, address, port });
        setStatus((prev) => {
          prev[index] = UPLOAD_STATUS.FINISHED;
          return prev;
        });
      } catch {
        setStatus((prev) => {
          prev[index] = UPLOAD_STATUS.FAILED;
          return prev;
        });
      }
    }

    await handleFirmList();
    showToast({ message: t('업로드 완료') });
  };
  /* ======   useEffect   ====== */
  return (
    <>
      {Toasts}
      <ModalWithBtn
        hasCloseBtn
        defaultLoading={isMutating}
        button={
          <Button onClick={handleFirmList} disabled={disabled} themeColor="tertiary">
            {t('업데이트')}
          </Button>
        }
      >
        <div className="p-5 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
          <div className="flex justify-between items-center">
            <H2>{t('TCM 펌웨어 업데이트')}</H2>
            <ModalWithBtn
              hasButton={[okBtn, cancelBtn]}
              button={
                <Button smoothLoading themeColor="quaternary" themeSize="sm">
                  <span className="whitespace-nowrap">{t('리붓')}</span>
                </Button>
              }
              onClose={(value) => value === okBtn && handleReboot()}
            >
              {t('리붓하겠습니까?')}
            </ModalWithBtn>
          </div>
          <div className="flex items-center gap-2 w-[400px]">
            <Combo
              width="100%"
              onChange={handleFileSelect}
              placeholder={t('펌웨어')}
              options={[newFile].concat(fileList).map((x) => ({ value: x, label: x }))}
            ></Combo>
            <ModalWithBtn
              hasButton={[okBtn, cancelBtn]}
              button={
                <Button disabled={hasBackup} themeColor="primary" themeSize="sm">
                  <span className="whitespace-nowrap">{t('적용')}</span>
                </Button>
              }
              onClose={(value) => value === okBtn && handleApply()}
            >
              {t('파일을 적용 하시겠습니까?')}
            </ModalWithBtn>
            {/* <ModalWithBtn
              hasButton={['OK', cancelBtn]}
              button={
                <Button disabled={!applying} themeColor="quaternary" themeSize="sm">
                  <span className="whitespace-nowrap">중단</span>
                </Button>
              }
              onClose={(value) => value === 'OK' && handleUpdateStop()}
            >
              적용을 중단하시겠습니까?
            </ModalWithBtn> */}
            <ModalWithBtn
              hasButton={[okBtn, cancelBtn]}
              button={
                <Button disabled={hasBackup} themeColor="secondary" themeSize="sm">
                  <span className="whitespace-nowrap">{t('삭제')}</span>
                </Button>
              }
              onClose={(value) => value === okBtn && handleFileDelete()}
            >
              {t('파일을 삭제하시겠습니까?')}
            </ModalWithBtn>
          </div>
          <div>
            <div className="w-[400px]">
              <ControlFileUpload
                disabled={selectedFile !== newFile}
                onSubmit={handleUpload}
                onCancel={handleUpdateStop}
              />
            </div>
          </div>
          {process ? (
            <div className="h-6 bg-slate-100 mt-3">
              <i
                className="text-right text-white not-italic block h-full w-full transition-all bg-gradient-to-r from-cyan-500 to-blue-500"
                style={{ width: `${process}%` }}
              >
                {process}%
              </i>
            </div>
          ) : null}
          {status.length ? (
            <div className="grid grid-cols-2 mt-6">
              {selectedRows?.map((row, index) => (
                <div key={index} className="mb-4 flex items-center">
                  <span className="text-sm font-medium text-gray-700 w-12">{row}:</span>
                  <span>{UPLOAD_STATUS[status[index]]}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </ModalWithBtn>
    </>
  );
};

export default ControlModalUpdate;
