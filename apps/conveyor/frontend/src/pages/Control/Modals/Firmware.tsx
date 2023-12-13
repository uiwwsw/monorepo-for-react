import { useDeleteBackup } from '!/control/application/delete-backup-firmware';
import { useFirmList } from '!/control/application/get-backup-firmware';
import { useUpdateFirm } from '!/control/application/post-update-firmware';
import { useTcmNetwork } from '!/redis/application/get-tcm-network';
import useToastsForControl from '#/useToastsForControl';
import Test from '@/Test';
import H2 from '@/Typography/H2';
import { Button, Combo, ModalWithBtn, ToastWithPortal } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useState } from 'react';

/* ======   interface   ====== */
export interface ModalFirmwareProps {
  tcmId?: number;
  address?: string;
}

/* ======    global     ====== */
const logger = createLogger('pages/Control/Modals/Firmware');

const ModalFirmware = ({ tcmId, address }: ModalFirmwareProps) => {
  /* ======   variables   ====== */
  const [selectedFile, setSelectedFile] = useState('');
  const { data, error, trigger, isMutating } = useFirmList();
  const { trigger: deleteTrigger } = useDeleteBackup();
  const { trigger: updateTrigger } = useUpdateFirm();
  const { trigger: networkTrigger } = useTcmNetwork();
  const { Toasts, adapterEvent } = useToastsForControl({ selectedRows: [selectedFile] });

  /* ======   function    ====== */
  const handleFirmList = async () => {
    if (!tcmId || !address) return;
    const port = await networkTrigger({ tcm_id: tcmId });
    trigger({ port, address });
  };

  const handleFileSelect = (selectedFileName: string) => setSelectedFile(selectedFileName);

  const handleFileDelete = async () => {
    if (!tcmId || !address) return;
    const port = await networkTrigger({ tcm_id: tcmId });

    await deleteTrigger({
      fileName: selectedFile,
      address,
      port,
    });

    setSelectedFile('');
    await handleFirmList();
  };

  const handleFileUpdate = () =>
    adapterEvent({
      startMsg: '선택한 펌웨어 업데이트 중입니다.',
      successMsg: '펌웨어 업데이트 완료',
      failMsg(fails) {
        logger(fails);
        return fails.map((v) => `${v.id}파일 ${v.message} 에러 발생`).join(',');
      },
      async event(id) {
        if (!tcmId || !address) return;
        const port = await networkTrigger({ tcm_id: tcmId });
        return updateTrigger({
          fileName: id,
          address,
          port,
        });
      },
    });

  /* ======   useEffect   ====== */
  logger(error, data);
  return (
    <>
      {Toasts}
      <ToastWithPortal open={error?.message}>{error?.message}</ToastWithPortal>
      <ModalWithBtn
        button={
          <Test>
            <Button themeSize="sm" themeColor={'tertiary'} onClick={handleFirmList}>
              Firmware
            </Button>
          </Test>
        }
        hasButton={['CANCEL']}
        defaultLoading={isMutating}
        hasCloseBtn
      >
        <H2>TCM {tcmId} 펌웨어 업데이트</H2>
        <div className="flex flex-col space-y-4 mt-4">
          <div>
            <span className="text-sm font-medium">파일 선택:</span>
            <Combo
              width="300px"
              onChange={handleFileSelect}
              placeholder="백업 파일"
              options={data?.map((x) => ({ value: x, label: x }))}
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
