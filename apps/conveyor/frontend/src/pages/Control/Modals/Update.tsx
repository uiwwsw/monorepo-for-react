import { Button, Combo, ModalWithBtn } from '@library-frontend/ui';
import { useMemo, useRef, useState } from 'react';
import { createLogger } from '@package-frontend/utils';
import Upload from '../Upload';
import { useUploadFirm } from '!/control/application/put-upload-firmware';
import { useUpdateFirm } from '!/control/application/post-update-firmware';
import { useTcmNetwork } from '!/redis/application/get-tcm-network';
import Test from '@/Test';
import { useFirmList } from '!/control/application/get-backup-firmware';
import { useDeleteBackup } from '!/control/application/delete-backup-firmware';

/* ======   interface   ====== */
export interface ModalUpdateProps {
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

const ModalUpdate = ({ selectedRows, disabled, selectedAdds }: ModalUpdateProps) => {
  /* ======   variables   ====== */
  const newFile = '새 파일 업로드';
  const [selectedFile, setSelectedFile] = useState('');
  const { trigger: deleteTrigger } = useDeleteBackup();
  const [fileList, setFileList] = useState<string[]>([]);
  const { trigger: updateTrigger } = useUpdateFirm();
  const { trigger: firmListTrigger, isMutating } = useFirmList();
  const { trigger: uploadTrigger, process } = useUploadFirm();
  const { trigger: networkTrigger } = useTcmNetwork();

  const [status, setStatus] = useState<UPLOAD_STATUS[]>([]);
  const continueUpdatingRef = useRef(true);
  const hasBackup = useMemo(() => !(selectedFile !== newFile && !!selectedFile), [selectedFile]);
  /* ======   function    ====== */
  const handleFileDelete = () => {
    if (!selectedRows || !selectedAdds) return;
    setFileList([]);
    selectedRows.forEach(async (tcmId, index) => {
      const address = selectedAdds[index];
      const port = await networkTrigger({ tcm_id: tcmId });
      await deleteTrigger({
        fileName: selectedFile,
        address,
        port,
      });
    });

    setSelectedFile('');
    handleFirmList();
  };
  const handleApply = () => {
    if (!selectedRows || !selectedAdds) return;
    setFileList([]);
    selectedRows.forEach(async (tcmId, index) => {
      const address = selectedAdds[index];
      const port = await networkTrigger({ tcm_id: tcmId });
      await updateTrigger({ fileName: selectedFile, address, port });
    });

    setSelectedFile('');
    handleFirmList();
  };
  const handleFirmList = () => {
    if (!selectedRows || !selectedAdds) return;
    setFileList([]);
    selectedRows.forEach(async (tcmId, index) => {
      const address = selectedAdds[index];
      const port = await networkTrigger({ tcm_id: tcmId });
      const data = await firmListTrigger({ port, address });
      if (!data) return;
      setFileList((prev) => (prev.length ? prev.filter((x) => data.includes(x)) : data));
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

    const fileName = await uploadTrigger({ file });
    logger(process);
    if (fileName === undefined) return;

    if (!selectedRows || !selectedAdds) return;
    setStatus(Array(selectedRows.length).fill(UPLOAD_STATUS.IDLE));

    for (let index = 0; index < selectedRows.length; index++) {
      if (!continueUpdatingRef.current) throw new Error('강제 종료');
      logger('handleUpload', index);
      const tid = selectedRows[index];
      const port = await networkTrigger({ tcm_id: tid });
      const address = selectedAdds[index];
      setStatus((prev) => {
        prev[index] = UPLOAD_STATUS.UPDATING;
        return [...prev];
      });

      try {
        const status = await updateTrigger({ fileName, address, port });

        if (status)
          setStatus((prev) => {
            prev[index] = UPLOAD_STATUS.FINISHED;
            return [...prev];
          });
        throw new Error('문제발생');
      } catch (error) {
        console.error('ERROR updating row:', tid, error);
        setStatus((prev) => {
          prev[index] = UPLOAD_STATUS.FAILED;
          return [...prev];
        });
      }
    }
  };
  /* ======   useEffect   ====== */
  return (
    <>
      <ModalWithBtn
        hasCloseBtn
        defaultLoading={isMutating}
        button={
          <Test>
            <Button onClick={handleFirmList} disabled={disabled} themeColor="tertiary">
              Update
            </Button>
          </Test>
        }
        hasButton={['CANCEL']}
      >
        <div className="p-5 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">TCM 펌웨어 업데이트</h2>
          <div className="flex items-center gap-2 w-[400px]">
            <Combo
              width="100%"
              onChange={handleFileSelect}
              placeholder="펌웨어"
              options={[newFile].concat(fileList).map((x) => ({ value: x, label: x }))}
            ></Combo>
            <ModalWithBtn
              hasButton={['OK', 'CANCEL']}
              button={
                <Button disabled={hasBackup} themeColor="primary" themeSize="sm">
                  <span className="whitespace-nowrap">적용</span>
                </Button>
              }
              onClose={(value) => value === 'OK' && handleApply()}
            >
              파일을 적용 하시겠습니까?
            </ModalWithBtn>
            <ModalWithBtn
              hasButton={['OK', 'CANCEL']}
              button={
                <Button disabled={hasBackup} themeColor="secondary" themeSize="sm">
                  <span className="whitespace-nowrap">삭제</span>
                </Button>
              }
              onClose={(value) => value === 'OK' && handleFileDelete()}
            >
              파일을 삭제하시겠습니까?
            </ModalWithBtn>
          </div>
          <div>
            <div className="w-[400px]">
              <Upload disabled={selectedFile !== newFile} onSubmit={handleUpload} onCancel={handleUpdateStop} />
            </div>
          </div>
          <div className="h-6 bg-slate-100 mt-3">
            <i
              className="text-right text-white not-italic block h-full w-full transition-all bg-gradient-to-r from-cyan-500 to-blue-500"
              style={{ width: `${process}%` }}
            >
              {process}%
            </i>
          </div>
          <div className="grid grid-cols-2 mt-6">
            {selectedRows?.map((row, index) => (
              <div key={index} className="mb-4 flex items-center">
                <span className="text-sm font-medium text-gray-700 w-12">{row}:</span>
                <span>{UPLOAD_STATUS[status[index]]}</span>
              </div>
            ))}
          </div>
        </div>
      </ModalWithBtn>
    </>
  );
};

export default ModalUpdate;
